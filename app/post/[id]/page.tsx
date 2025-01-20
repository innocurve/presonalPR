'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Language, translate } from '../../utils/translations'

interface PostParams {
  id: string;
}

interface PostData {
  id: number;
  title: { [key in Language]: string };
  date: string;
  views: number;
  image: string;
  description: { [key in Language]: string };
  content?: { [key in Language]: string };
  gallery?: Array<{
    id: number;
    image: string;
    title: { [key in Language]: string };
    description: { [key in Language]: string };
    content: { [key in Language]: string };
  }>;
}

export default function Post({ params }: { params: PostParams }) {
  const router = useRouter()
  const [post, setPost] = useState<PostData | null>(null)
  const [language, setLanguage] = useState<Language>('ko')

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      setLanguage(storedLanguage as Language);
    }

    const handleLanguageChange = (e: StorageEvent) => {
      if (e.key === 'language' && e.newValue) {
        setLanguage(e.newValue as Language);
      }
    };

    window.addEventListener('storage', handleLanguageChange);
    return () => window.removeEventListener('storage', handleLanguageChange);
  }, []);

  useEffect(() => {
    const fetchPost = () => {
      try {
        const storedPosts = localStorage.getItem('posts');
        if (!storedPosts) {
          throw new Error('Posts not found');
        }
        
        const posts = JSON.parse(storedPosts);
        const foundPost = posts.find((p: PostData) => p.id === Number(params.id));
        
        if (!foundPost) {
          throw new Error('Post not found');
        }
        
        setPost(foundPost);
      } catch (error) {
        console.error('Error fetching post:', error);
        router.push('/');
      }
    };

    fetchPost();
  }, [params.id, router]);

  if (!post) {
    return <div>Loading...</div>
  }

  const handleGalleryClick = (galleryId: number) => {
    router.push(`/gallery/${galleryId}`);
  };

  return (
    <div className="max-w-3xl mx-auto p-5 mt-24">
      <Card>
        <CardHeader>
          <CardTitle>{post.title[language]}</CardTitle>
        </CardHeader>
        <CardContent>
          <Image 
            src={post.image} 
            alt={post.title[language]} 
            width={600} 
            height={400} 
            className="w-full h-64 object-cover mb-4 rounded-lg"
          />
          <p className="text-sm text-gray-500 mb-4">{translate('date', language)}: {post.date} | {translate('views', language)}: {post.views}</p>
          <p className="font-bold mb-2">{translate('summary', language)}</p>
          <p className="mb-4">{post.description[language]}</p>
          
          {post.gallery && (
            <div>
              <h3 className="text-xl font-bold mb-4">{translate('gallery', language)}</h3>
              <div className="grid grid-cols-2 gap-4">
                {post.gallery.map((item) => (
                  <div 
                    key={item.id} 
                    className="cursor-pointer relative group"
                    onClick={() => handleGalleryClick(item.id)}
                  >
                    <Image 
                      src={item.image} 
                      alt={item.title[language]}
                      width={300}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 rounded-lg" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                      <h4 className="text-white text-sm font-semibold truncate">
                        {item.title[language]}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-8">
            <Button onClick={() => router.push('/#community')}>{translate('backToList', language)}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

