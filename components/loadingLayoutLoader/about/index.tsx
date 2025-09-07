/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingAbout() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"flex","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%","flexDirection":"column","gap":"10px"}}>
      <div style={{"display":"block"}}>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </div>
      <div style={{"display":"block"}}>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </div>
      <div style={{"display":"block"}}>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </div>
      <div style={{"display":"block"}}>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      </div>
      <div style={{"display":"block"}}>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
      </div>
      <div style={{"display":"block"}}>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      </div>
    </div>
    </div>
  );
}
