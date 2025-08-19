'use client';
import { Flex, Skeleton } from 'antd';

export default function LoadingStudent() {
  return (
    <div className="relative !z-0 h-screen">
    <Flex style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","height":"100%","gap":"10px","justifyContent":"center","alignItems":"center"}}>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Flex style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","width":"100%","gap":"5px","justifyContent":"center","alignItems":"center"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </Flex>
    </Flex>
    </div>
  );
}
