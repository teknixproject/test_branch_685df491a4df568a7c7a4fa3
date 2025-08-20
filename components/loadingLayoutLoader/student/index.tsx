'use client';
import React from 'react';
import { Divider, Skeleton } from 'antd';

export default function LoadingStudent() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%","justifyContent":"center","alignItems":"center","gap":"10px"}}>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
      <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
      <Flex style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </Flex>
      <Row style={{"display":"grid","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </Row>
    </div>
    </div>
  );
}
