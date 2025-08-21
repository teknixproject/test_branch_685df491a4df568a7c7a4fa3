'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"50px","paddingLeft":"10px","width":"100%","height":"auto"}}>
      <Skeleton.Node size={"middle"} tableLayout={"auto"} bordered={false} loading={false} pagination={false} dataSource={[{"key":"1","name":"Mike","age":32,"address":"10 Downing Street"},{"key":"2","name":"Mike","age":32,"address":"10 Downing Street"},{"key":"3","name":"Mike","age":32,"address":"10 Downing Street"},{"key":"4","name":"Mike","age":32,"address":"10 Downing Street"}]} pagination-showSizeChanger={false}></Skeleton.Node>
      <Skeleton.Input rootClassName="!padding-5px !display-flex !flex-direction-column !gap-15px">
        <Skeleton.Input dataSource={[{"name":"label","type":"data"}]} label={"Email"} required={false} layout={"vertical"} block={true} rootClassName="!grid-column-span 6 / span 6">
          <Skeleton.Input placeholder={"Nhập email của bạn"} defaultValue={""}></Skeleton.Input>
        </Skeleton.Input>
        <Skeleton size={"middle"} type={"primary"} iconData={null} shape={"default"} children={"Call"} block={false} ghost={false} danger={false} disabled={false} htmlType={"submit"}></Skeleton>
      </Skeleton.Input>
      <Skeleton.Image data={[{"year":"1991","value":8},{"year":"1992","value":9},{"year":"1993","value":9.1},{"year":"1994","value":9.3},{"year":"1995","value":12},{"year":"1996","value":12.9},{"year":"1997","value":12.9}]} xField={"year"} yField={"value"} title={"Title chart"} style-lineWidth={2} area-style-fill={"transparent"}></Skeleton.Image>
      <Skeleton size={"middle"} type={"primary"} shape={"default"} children={""} block={false} ghost={false} danger={false} disabled={false} htmlType={"button"}></Skeleton>
      <Skeleton.Image data={[{"year":"1991","value":8},{"year":"1992","value":9},{"year":"1993","value":9.1},{"year":"1994","value":9.3},{"year":"1995","value":12},{"year":"1996","value":12.9},{"year":"1997","value":12.9}]} xField={"year"} yField={"value"} title={"Title chart"}></Skeleton.Image>
      <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Skeleton children={"ssssssssssssss"}></Skeleton>
        <Skeleton children={"aaaaaaaaa"}></Skeleton>
        <Skeleton size={"middle"} type={"primary"} shape={"default"} children={""} block={false} ghost={false} danger={false} disabled={false} htmlType={"button"}></Skeleton>
      </div>
      <div style={{"display":"grid","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}></div>
    </div>
    </div>
  );
}
