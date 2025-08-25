/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingSubject() {
  return (
    <div className="relative !z-0 h-screen">
    <div style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%"}}>
      <Skeleton active={true} block={true} />
    </div>
    </div>
  );
}
