"use client";

import { cn } from "@/lib/utils";
import React from "react";
import sach from "@/image/sach.jpg";
import { Button } from "@/components/ui/button";
import { Panigation } from "@/components/panigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

const maxPageNumber = 5;

const userInfors = [
  {
    userInfor: "1",
    studentCode: 2023606461,
    studentName: "Hoàng Vân Anh",
    classCode: "CNTT07",
    gmail: "abc123@gmail.com",
    score: 0,
  },
  {
    userInfor: "2",
    studentCode: 2023606462,
    studentName: "Nguyễn Bình An",
    classCode: "CNTT07",
    gmail: "abc123@gmail.com",
    score: 0,
  },
  {
    userInfor: "3",
    studentCode: 2023606463,
    studentName: "Hoàng Việt Anh",
    classCode: "CNTT07",
    gmail: "abc123@gmail.com",
    score: 0,
  },
  {
    userInfor: "4",
    studentCode: 2023606464,
    studentName: "Nguyễn Ngọc Bình",
    classCode: "CNTT07",
    gmail: "abc123@gmail.com",
    score: 0,
  },
  {
    userInfor: "5",
    studentCode: 2023606464,
    studentName: "Nguyễn Ngọc Bình",
    classCode: "CNTT07",
    gmail: "abc123@gmail.com",
    score: 0,
  },
  {
    userInfor: "6",
    studentCode: 2023606464,
    studentName: "Nguyễn Ngọc Bình",
    classCode: "CNTT07",
    gmail: "abc123@gmail.com",
    score: 0,
  },
];

interface Type {
  role: String;
}

export default function ListUI({ role }: Type) {
  return (
    <div className="">
      <div className="">
        <Image
          src={sach}
          alt="avatar"
          className="w-full h-[50px] object-cover "
        ></Image>
      </div>

      <div className={cn("p-[var(--paddingDiv)] w-[100%] mx-auto relative")}>
        <div className={cn("mb-[var(--distanceAll)]")}>
          <Button>Lớp 2025TD01</Button>
          <Button className="ml-[15px]">Lớp 2025TD02</Button>
        </div>
        <h1 className={cn("text-2xl text-blue-500 mb-[var(--distanceAll)] ")}>
          Thông tin lớp học 2025TD01
        </h1>
        <Table className="border-2 mb-[var(--distanceAll)]">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">STT</TableHead>
              <TableHead>Mã sinh viên</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Lớp</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">TX1</TableHead>
              <TableHead className="text-right">TX2</TableHead>
              <TableHead className="text-right">Điểm cuối</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {userInfors.map((infor) => (
              <TableRow
                key={infor.userInfor}
                className={cn(infor.userInfor % 2 === 0 && "bg-[#f6f0f0]")}
              >
                <TableCell className="font-medium">{infor.userInfor}</TableCell>
                <TableCell>{infor.studentCode}</TableCell>
                <TableCell>{infor.studentName}</TableCell>
                <TableCell>{infor.classCode}</TableCell>
                <TableCell>{infor.gmail}</TableCell>
                <TableCell className="text-right">{infor.score}</TableCell>
                <TableCell className="text-right">{infor.score}</TableCell>
                <TableCell className="text-right">{infor.score}</TableCell>
                <TableCell className="text-right">
                  <Button>Sửa đổi</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="fixed right-[100px] bottom-[50px]">
          <Panigation />
        </div>
      </div>
    </div>
  );
}
