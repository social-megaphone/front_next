'use client'
import TopGoBackBar from '@/components/layout/topBar/TopGobackBar'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

export default function Add() {
  return (
    <div>
      <TopGoBackBar title="하루잇 Haru-It" subTitle="추가하기" />

      <div className="text-4xl">Add</div>
      <div className="p-8 w-full h-60">
        <div className="w-full flex items-center bg-haru-brown/40 justify-center h-full border border-haru-brown rounded-3xl">
          <PlusCircle className="w-12 h-12 text-white" />
        </div>
      </div>
    </div>
  )
}
