'use client';
import React from 'react';
import { Flex, Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"50px","paddingLeft":"10px","width":"100%","height":"auto"}}>
      <Skeleton active={true} />
      <Skeleton.Input active={true} rootClassName="!p-[5px] !flex !flex-col">
        <Skeleton.Input active={true} block={true}>
          <Skeleton.Input active={true} />
        </Skeleton.Input>
        <div size={"middle"} type={"primary"} iconData={null} shape={"default"} children={"Call"} block={false} ghost={false} danger={false} disabled={false} htmlType={"submit"} />
      </Skeleton.Input>
      <Skeleton active={true} />
      <div size={"middle"} type={"primary"} shape={"default"} children={""} block={false} ghost={false} danger={false} disabled={false} htmlType={"button"} />
      <Skeleton active={true} />
      <Flex style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <div children={"ssssssssssssss"} />
        <div children={"aaaaaaaaa"} />
        <div size={"middle"} type={"primary"} shape={"default"} children={""} block={false} ghost={false} danger={false} disabled={false} htmlType={"button"} />
      </Flex>
      <div style={{"display":"grid","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}} />
      <Skeleton active={true} />
    </div>
    </div>
  );
}
