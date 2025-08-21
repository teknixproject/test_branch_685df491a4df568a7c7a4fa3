'use client';
import React from 'react';
import { Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
    <div style={{"display":"block","paddingTop":"10px","paddingRight":"10px","paddingBottom":"50px","paddingLeft":"10px","width":"100%","height":"100%"}}>
      <div style={{"padding":"10px","display":"flex","paddingTop":"0px","paddingRight":"0px","paddingBottom":"0px","paddingLeft":"0px","width":"100%","height":"100vh","backgroundColor":"#f5f7fa","flexDirection":"column"}}>
        <div style={{"display":"flex","flexDirection":"row","paddingTop":"20px","paddingLeft":"38px","paddingRight":"38px","paddingBottom":"20px","height":"100px","justifyContent":"space-between","backgroundColor":"#ffffff","alignItems":"center"}}>
          <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
            <Skeleton.Button active={true} rootClassName="!text-[28px]" />
          </div>
          <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","alignItems":"center","gap":"16px"}}>
            <Skeleton.Input active={true} rootClassName="!rounded-[40px]" />
            <Skeleton.Button active={true} />
          </div>
        </div>
        <div style={{"display":"flex","flexDirection":"column","paddingTop":"16px","paddingLeft":"38px","paddingRight":"38px","paddingBottom":"16px","flex":"1","marginTop":"0px","marginLeft":"0px","marginRight":"0px","marginBottom":"0px","gridColumn":"undefined","gridRow":"undefined","justifyContent":"undefined","alignItems":"undefined","gap":"16px","gridTemplateColumns":"undefined","gridTemplateRows":"undefined","width":"undefined","height":"undefined","backgroundColor":"undefined","border":"undefined","borderRadius":"undefined","top":"undefined","left":"undefined","position":"undefined","right":"undefined","bottom":"undefined","fontSize":"undefined","color":"undefined","fontWeight":"undefined","fontStyle":"undefined","opacity":"undefined","objectFit":"undefined","overflow":"auto"}}>
          <div style={{"display":"flex","flexDirection":"row","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"16px","marginBottom":"16px"}}>
            <Skeleton.Input active={true} rootClassName="!p-[5px] !flex !flex-row">
              <div style={{"display":"flex","flexDirection":"column","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"8px"}}>
                <Skeleton.Button active={true} rootClassName="!text-[16px]" />
                <Skeleton.Input active={true} rootClassName="!w-[320px]" />
              </div>
              <div style={{"display":"flex","flexDirection":"column","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"8px"}}>
                <Skeleton.Button active={true} rootClassName="!text-[16px]" />
                <Skeleton.Input active={true} rootClassName="!w-[320px]" />
              </div>
              <div style={{"display":"flex","flexDirection":"column","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"8px"}}>
                <Skeleton.Button active={true} rootClassName="!text-[16px]" />
                <Skeleton.Input active={true} rootClassName="!w-[320px]" />
              </div>
            </Skeleton.Input>
          </div>
          <div style={{"display":"grid","flexDirection":"row","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"32px","gridTemplateColumns":"repeat(8, minmax(0, 1fr))"}}>
            <div style={{"display":"grid","flexDirection":"row","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gridColumn":"span 4 / span 4","gap":"32px","gridTemplateColumns":"repeat(2, minmax(0, 1fr))"}}>
              <div style={{"display":"flex","flexDirection":"column","paddingTop":"16px","paddingLeft":"16px","paddingRight":"16px","paddingBottom":"16px","backgroundColor":"#ffffff","borderRadius":"25px"}}>
                <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","gap":"16px"}}>
                  <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","width":"70px","height":"70px","backgroundColor":"#e7edff","borderRadius":"100%","justifyContent":"center","alignItems":"center"}}>
                    <Skeleton.Button active={true} rootClassName="!bg-[#3c00ff00] !text-[#3c00ff]" />
                  </div>
                  <div style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
                    <Skeleton.Button active={true} rootClassName="!text-[16px]" />
                    <Skeleton.Button active={true} rootClassName="!text-[20px]" />
                  </div>
                </div>
              </div>
              <div style={{"display":"flex","flexDirection":"column","paddingTop":"16px","paddingLeft":"16px","paddingRight":"16px","paddingBottom":"16px","backgroundColor":"#ffffff","borderRadius":"25px"}}>
                <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","gap":"16px"}}>
                  <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","width":"70px","height":"70px","backgroundColor":"#ffe0eb","borderRadius":"100%","justifyContent":"center","alignItems":"center"}}>
                    <Skeleton.Button active={true} rootClassName="!bg-[#3c00ff00] !text-[#ff82ac]" />
                  </div>
                  <div style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
                    <Skeleton.Button active={true} rootClassName="!text-[16px]" />
                    <Skeleton.Button active={true} rootClassName="!text-[20px]" />
                  </div>
                </div>
              </div>
              <div style={{"display":"flex","flexDirection":"column","paddingTop":"16px","paddingLeft":"16px","paddingRight":"16px","paddingBottom":"16px","backgroundColor":"#ffffff","borderRadius":"25px"}}>
                <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","gap":"16px"}}>
                  <div style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","width":"70px","height":"70px","backgroundColor":"#fff5d9","borderRadius":"100%","justifyContent":"center","alignItems":"center"}}>
                    <Skeleton.Button active={true} rootClassName="!bg-[#3c00ff00] !text-[#ffbb38]" />
                  </div>
                  <div style={{"display":"flex","flexDirection":"column","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px"}}>
                    <Skeleton.Button active={true} rootClassName="!text-[16px]" />
                    <Skeleton.Button active={true} rootClassName="!text-[20px]" />
                  </div>
                </div>
              </div>
            </div>
            <div style={{"display":"flex","flexDirection":"row","paddingTop":"16px","paddingLeft":"16px","paddingRight":"16px","paddingBottom":"8px","gridColumn":"span 4 / span 4","height":"252px","backgroundColor":"#ffffff","borderRadius":"25px","justifyContent":"center","alignItems":"center"}}>
              <Skeleton active={true} rootClassName="!w-full !h-full" />
            </div>
          </div>
          <div style={{"display":"flex","flexDirection":"column","paddingTop":"0px","paddingLeft":"0px","paddingRight":"0px","paddingBottom":"0px","gap":"16px"}}>
            <Skeleton.Button active={true} rootClassName="!text-[22px]" />
            <Skeleton active={true} />
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
