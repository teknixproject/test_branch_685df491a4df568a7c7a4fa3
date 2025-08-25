/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <div mount={true} style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%"}}>
      <div style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","justifyContent":"center","alignItems":"center","gap":"5px"}}>
        <div style={{"display":"block"}}>
        <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true} shape={"circle"} size={"large"} style={{"width":"auto","height":"auto","justifyContent":"center","alignItems":"center"}}></Skeleton.Avatar>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Image active={true} avatar={true} title={true} paragraph={true} style={{"width":"100%"}}></Skeleton.Image>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Button active={true} avatar={true} title={true} paragraph={true} shape={"circle"} style={{"width":"500px","height":"500px"}}></Skeleton.Button>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true} style={{"width":"100%"}}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"block"}}>
        <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
        </div>
        <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","justifyContent":"center","alignItems":"center","gap":"5px"}}>
          <div style={{"display":"block"}}>
          <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
          </div>
          <div style={{"display":"block"}}>
          <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
          </div>
          <div style={{"display":"block"}}>
          <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
          </div>
          <div style={{"display":"block"}}>
          <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
          </div>
          <div style={{"display":"block"}}>
          <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
