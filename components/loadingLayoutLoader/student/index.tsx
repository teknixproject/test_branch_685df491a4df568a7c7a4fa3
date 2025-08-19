'use client';
import { Skeleton } from 'antd';

export default function LoadingStudent() {
  return (
    <div className="relative !z-0 h-screen">
    <container mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%","justifyContent":"center","alignItems":"center","gap":"10px"}}>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
    </container>
    </div>
  );
}
