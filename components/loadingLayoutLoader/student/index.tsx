/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingStudent() {
  return (
    <div className="relative !z-0 h-screen">
    <div style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"10px","paddingLeft":"10px","width":"100%","height":"100%"}}>
      <div style={{"display":"flex","paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","width":"100%","height":"100vh","flexDirection":"column"}}>
        <div style={{"display":"flex","flexDirection":"row","paddingTop":"20px","paddingLeft":"38px","paddingRight":"38px","paddingBottom":"20px","height":"100px","justifyContent":"space-between","backgroundColor":"#ffffff","alignItems":"center"}}>
          <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","gap":"16px","alignItems":"center"}}>
            <Skeleton.Button active={true} />
            <Skeleton.Button active={true} rootClassName="!text-[28px] !bg-[undefined] !border-[undefined] !text-[undefined]" />
          </div>
          <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","alignItems":"center","gap":"16px"}}>
            <Skeleton.Input active={true} rootClassName="!rounded-[40px]" />
          </div>
        </div>
        <div style={{"display":"flex","flexDirection":"column","paddingTop":"38px","paddingLeft":"38px","paddingRight":"38px","paddingBottom":"38px","flex":"1","gridColumn":"undefined","gridRow":"undefined","justifyContent":"undefined","alignItems":"undefined","gap":"16px","gridTemplateColumns":"undefined","gridTemplateRows":"undefined","width":"undefined","height":"undefined","marginTop":"undefined","marginLeft":"undefined","marginRight":"undefined","marginBottom":"undefined","backgroundColor":"#f5f7fa","border":"undefined","borderRadius":"undefined","top":"undefined","left":"undefined","position":"undefined","right":"undefined","bottom":"undefined","fontSize":"undefined","color":"undefined","fontWeight":"undefined","fontStyle":"undefined","opacity":"undefined","objectFit":"undefined","overflow":"auto"}}>
          <div style={{"display":"flex","flexDirection":"column","paddingTop":"32px","paddingLeft":"32px","paddingRight":"32px","paddingBottom":"32px","backgroundColor":"#ffffff","borderRadius":"25px","gap":"16px"}}>
            <Skeleton.Input active={true} rootClassName="!pt-[5px] !pl-[5px] !pr-[5px] !pb-[5px] !flex !flex-col">
              <div style={{"display":"grid","flexDirection":"row","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"8px","gridTemplateColumns":"repeat(2, minmax(0, 1fr))"}}>
                <div style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","gap":"8px"}}>
                  <div style={{"display":"flex","flexDirection":"row","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","justifyContent":"space-between"}}>
                    <Skeleton.Button active={true} />
                    <Skeleton.Button active={true} />
                  </div>
                  <Skeleton.Input active={true} rootClassName="!rounded-[15px] !h-[50px] !pl-[20px] !pr-[20px]" />
                </div>
              </div>
              <Skeleton active={true} block={true} />
              <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
                <Skeleton.Button active={true} rootClassName="!h-[50px] !text-[18px] !pl-[30px] !pr-[30px]" />
              </div>
              <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","marginTop":"40px","justifyContent":"flex-end","gap":"16px"}}>
                <Skeleton.Button active={true} rootClassName="!h-[50px] !w-[190px] !rounded-[15px] !text-[18px]" />
                <Skeleton.Button active={true} rootClassName="!w-[190px] !h-[50px] !rounded-[15px] !text-[18px]" />
              </div>
            </Skeleton.Input>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
