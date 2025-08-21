'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <div style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"50px","paddingLeft":"10px","width":"100%","height":"auto"}}>
      <Skeleton active={true} block={true} />
      <Skeleton.Input active={true} rootClassName="!p-[5px] !flex !flex-col">
        <Skeleton.Input active={true} block={true}>
          <Skeleton.Input active={true} />
        </Skeleton.Input>
        <Skeleton.Button active={true} />
      </Skeleton.Input>
      <Skeleton active={true} />
      <Skeleton.Button active={true} />
      <Skeleton active={true} />
      <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Skeleton.Button active={true} />
        <Skeleton.Button active={true} />
        <Skeleton.Button active={true} />
      </div>
      <div style={{"display":"grid","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}} />
      <Skeleton active={true} block={true} />
    </div>
    </div>
  );
}
