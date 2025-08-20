'use client';
import { Skeleton } from 'antd';

export default function LoadingAbout() {
  return (
    <div className="relative !z-0 h-screen">
    <container mount={true} style={{"display":"flex","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%","flexDirection":"column","gap":"10px"}}>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
    </container>
    </div>
  );
}
