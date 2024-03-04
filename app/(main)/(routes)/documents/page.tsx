'use client'
import Image from 'next/image'
import React from 'react'

import { useUser } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { toast } from 'sonner'




import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const DocumentPage = () => {
  const {user} = useUser()
  const create = useMutation(api.documents.create);

  const onCreate = () => {
    const promise = create({title : "Untitled"});
    toast.promise(promise , {
      loading : "Creating a new note..",
      success : "New note creted",
      error : "Create new note again"
    })
  }
  return (
    <div className='h-full flex flex-col items-center justify-center space-y-4'>
      <Image src={'/assets/empty.png'} alt='Empty Image' width={300} height={300} className='dark:hidden' />
      <Image src={'/assets/empty-dark.png'} alt='Empty Image' width={300} height={300} className='dark:block hidden ' />
      <h2 className='text-lg font-medium'>
        Welcome to {user?.firstName}&apos;s
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className='h-4 w-4 mr-2' />
        Create a note
      </Button>
    </div>
  )
}

export default DocumentPage