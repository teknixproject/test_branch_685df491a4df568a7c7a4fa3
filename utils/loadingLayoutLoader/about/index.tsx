'use client';
import { Flex, Skeleton } from 'antd';

export default function LoadingAbout() {
  return (
    <div className="relative !z-0 h-screen">
    <Flex style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","height":"100%","justifyContent":"center","alignItems":"center"}}>
      <Skeleton active={true} avatar={true} title={true} paragraph={true}></Skeleton>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
    </Flex>
    </div>
  );
}
