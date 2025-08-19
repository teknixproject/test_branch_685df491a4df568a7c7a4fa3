'use client';
import { Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <container style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%"}}>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
    </container>
    </div>
  );
}
