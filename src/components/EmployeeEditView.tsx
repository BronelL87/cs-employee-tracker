'use client'

import { Employee } from '@/lib/interfaces/interfaces'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { updateEmployeeDetails } from '@/lib/services/employee-service'

const EmployeeEditView = ({ employee, setEdit }: { employee: Employee, setEdit: (value: boolean) => void }) => {
    
    const [jobTitle, setJobTitle] = useState(employee.jobTitle);
    const [details, setDetails] = useState(employee.details || "");
    const [status, setStatus] = useState(employee.status || "");
    const [hireDate, setHireDate] = useState(new Date(employee.hireDate));

        const handleSave = async () => {
      // Get token from storage
      const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
      const token = userData ? JSON.parse(userData).token : null;

      const updatedEmployee: Employee = {
        ...employee,
        jobTitle,
        details,
        status,
        hireDate: hireDate.toISOString(),
      };

      const success = await updateEmployeeDetails(token, updatedEmployee);

      if (success) {
        setEdit(false);
      }
    };


    return (
        <>
            <div>
                <p className="text-sm font-semibold">Job Title</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">{jobTitle || "Select job title"}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setJobTitle("Customer Support")}>Customer Support</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setJobTitle("IT Support Specialist")}>IT Support Specialist</DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => setJobTitle("Software Engineer")}>Software Engineer</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <p className="text-sm font-semibold">Details</p>
                <Input value={details} onChange={(e) => setDetails(e.target.value)}/>
            </div>

            <div>
                <p className="text-sm font-semibold">Status</p>
                <Select  value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Status</SelectLabel>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Sick">Sick</SelectItem>
                            <SelectItem value="Out of Office">Out of Office</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <p className="text-sm font-semibold">Hire Date</p>
                <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={"outline"}
                                    className={cn("w-full justify-start text-left font-normal text-muted-foreground")}
                                >
                                    <CalendarIcon />
                                    <span>Pick a date</span>
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={hireDate}
                                    onSelect={(date) => {
                                    if (date) setHireDate(date)
                                    }}
                                   initialFocus 
                                />
                            </PopoverContent>
                        </Popover>
            </div>


            <div className="flex justify-between pt-4">
                <Button onClick={() => setEdit(false)}>Cancel</Button>
                {employee && <Button variant="outline" onClick={handleSave}>Save Edits</Button>}
            </div>
        </>
    )
}

export default EmployeeEditView