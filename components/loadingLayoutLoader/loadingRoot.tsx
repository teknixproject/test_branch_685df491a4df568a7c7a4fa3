'use client';
import React from 'react';
import { Flex } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"50px","paddingLeft":"10px","width":"100%","height":"auto"}}>
      <Skeleton active />
      <Skeleton.Input active rootClassName="!p-[5px] !flex !flex-col">
        <Skeleton.Input active block>
          <Skeleton.Input active />
        </Skeleton.Input>
        <Button size={"middle"} type={"primary"} iconData={null} shape={"default"} children={"Call"} block={false} ghost={false} danger={false} disabled={false} htmlType={"submit"} />
      </Skeleton.Input>
      <Skeleton active />
      <Button size={"middle"} type={"primary"} shape={"default"} children={""} block={false} ghost={false} danger={false} disabled={false} htmlType={"button"} />
      <Skeleton active />
      <Flex style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Text children={"ssssssssssssss"} />
        <Text children={"aaaaaaaaa"} />
        <Button size={"middle"} type={"primary"} shape={"default"} children={""} block={false} ghost={false} danger={false} disabled={false} htmlType={"button"} />
      </Flex>
      <div style={{"display":"grid","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}} />
    </div>
    </div>
  );
}
