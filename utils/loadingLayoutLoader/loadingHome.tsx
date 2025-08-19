'use client';
import { Skeleton, Modal, Flex } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <Flex  style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","width":"100%","height":"100%"}}>
      <Skeleton active={true} avatar={true} title={true} paragraph={true} style={{"width":"100%","height":"500px"}}></Skeleton>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true} ></Skeleton.Avatar>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true} ></Skeleton.Input>
      <Skeleton active={true} avatar={true} title={true} paragraph={true} ></Skeleton>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true} ></Skeleton.Image>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true} ></Skeleton.Button>
      <Modal  >
        <Flex  ></Flex>
      </Modal>
    </Flex>
    </div>
  );
}
