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
      <div style={{"display":"block","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </div>
      <div style={{"display":"block","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </div>
      <div style={{"display":"block","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","justifyContent":"center","alignItems":"center","gap":"10px"}}>
        <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
      </div>
    </div>
    </div>
  );
}
