import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "../lib/axios";

export const columns = [
  {
    id: "select",
    header: null,
    cell: null,
  },
  {
    accessorKey: "day",
    header: "Day",
    cell: ({ row }) => <div className="capitalize">{row.getValue("day")}</div>,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{new Date(row.getValue("date")).toLocaleDateString()}</div>,
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => <div>{row.getValue("startTime")}</div>,
  },
  {
    accessorKey: "endTime",
    header: "End Time",
    cell: ({ row }) => <div>{row.getValue("endTime")}</div>,
  },
  {
    accessorKey: "room",
    header: "Room",
    cell: ({ row }) => <div className="capitalize">{row.getValue("room")}</div>,
  },
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const schedule = row.original;

  //     const handleEdit = () => {
  //       console.log("Edit schedule:", schedule);
  //     };

  //     const handleDelete = () => {
  //       console.log("Delete schedule:", schedule);
  //     };

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem onClick={() => navigator.clipboard.writeText(schedule.id)}>
  //             Copy schedule ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem onClick={handleEdit}>Edit schedule</DropdownMenuItem>
  //           <DropdownMenuItem onClick={handleDelete} className="text-red-500">
  //             Delete schedule
  //           </DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];

export default function InstructorPage() {
  const { id } = useParams();

  const { data, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        const res = await axios.get(`/student/course/${id}`);
        if (res.status !== 200) throw new Error(res.data.error || "Something went wrong");
        return res.data;
      } catch (error) {
        throw new Error(error.response.data.error);
      }
    },
  });

  React.useEffect(() => {
    refetch();
  }, [id]);

  const table = useReactTable({
    data: data?.schedules || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="w-full">
      <h1 className="text-center font-medium text-md tracking-wide">
        {data?.subject} - {data?.course}
      </h1>
      <p className="text-center font-medium">
        {data?.startTime} - {data?.endTime}{" "}
      </p>

      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter day..."
          value={table?.getColumn("day")?.getFilterValue() ?? ""}
          onChange={(event) => table?.getColumn("day")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table?.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table?.getRowModel().rows?.length ? (
              table?.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
