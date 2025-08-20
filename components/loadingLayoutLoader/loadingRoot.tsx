'use client';
import { Flex, Skeleton } from 'antd';

export default function LoadingRoot() {
  return (
    <div className="relative !z-0 h-screen">
      <container mount={true} style={{ "display": "block", "paddingTop": "10px", "paddingRight": "10px", "paddingBottom": "10px", "paddingLeft": "10px", "width": "100%", "height": "100%" }}>
        <Flex style={{ "display": "flex", "flexDirection": "column", "paddingTop": "5px", "paddingLeft": "5px", "paddingRight": "5px", "paddingBottom": "5px", "justifyContent": "center", "alignItems": "center", "gap": "5px" }}>
          <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true} shape={"circle"} size={"large"} style={{ "width": "auto", "height": "auto", "justifyContent": "center", "alignItems": "center" }}></Skeleton.Avatar>
          <Skeleton.Image active={true} avatar={true} title={true} paragraph={true} style={{ "width": "100%" }}></Skeleton.Image>
          <Skeleton.Button active={true} avatar={true} title={true} paragraph={true} shape={"circle"} style={{ "width": "500px", "height": "500px" }}></Skeleton.Button>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true} style={{ "width": "100%" }}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Skeleton.Input active={true} avatar={true} title={true} paragraph={true}></Skeleton.Input>
          <Flex style={{ "display": "flex", "flexDirection": "row", "paddingTop": "5px", "paddingLeft": "5px", "paddingRight": "5px", "paddingBottom": "5px", "justifyContent": "center", "alignItems": "center", "gap": "5px" }}>
            <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
            <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
            <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
            <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
            <Skeleton.Avatar active={true} avatar={true} title={true} paragraph={true}></Skeleton.Avatar>
          </Flex>
        </Flex>
      </container>
    </div>
  );
}
