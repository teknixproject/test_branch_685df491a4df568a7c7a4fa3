'use client';
  import {Skeleton, Modal, Flex } from 'antd';

  export default function LoadingAbout() {
    return (
         <flex  style={{"display":"flex","flexDirection":"row","paddingTop":"5px","paddingLeft":"5px","paddingRight":"5px","paddingBottom":"5px","height":"100%","justifyContent":"center","alignItems":"center"}}>
 <Table size={"middle"} tableLayout={"auto"} bordered={false} loading={false} pagination={false} pagination-current={1} pagination-total={10} pagination-limit={1000} pagination-pageSizeOptions={[10,20,50,100]} pagination-pageSize={100} dataSource={[{"key":"1","name":"Mike","age":32,"address":"10 Downing Street"},{"key":"2","name":"Mike","age":32,"address":"10 Downing Street"},{"key":"3","name":"Mike","age":32,"address":"10 Downing Street"},{"key":"4","name":"Mike","age":32,"address":"10 Downing Street"}]} style={{"width":"100%"}}></Table>
 </flex>
    )
  }
  