'use client';
import React from 'react';
import { Divider, Skeleton } from 'antd';

export default function LoadingStudent() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%","justifyContent":"center","alignItems":"center","gap":"10px"}}>
      <div style={{"display":"block"}}>
      <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
      </div>
      <div style={{"display":"block"}}>
      <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
      </div>
      <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <div style={{"display":"block"}}>
        <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        </div>
      </div>
      <div style={{"display":"grid","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <div style={{"display":"block"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        </div>
      </div>
      <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","justifyContent":"center","alignItems":"center","gap":"10px"}}>
        <div style={{"display":"block"}}>
        <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true}></Skeleton.Button>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Image active={true} avatar={true} title={true} paragraph={true}></Skeleton.Image>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
      </div>
      <div style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
        <div style={{"display":"block"}}>
        <Skeleton.Image active={true} avatar={true} title={true} paragraph={true} style={{"width":"100%"}}></Skeleton.Image>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true} style={{"width":"100%"}}></Skeleton.Input>
        </div>
      </div>
    </div>
    </div>
  );
}
