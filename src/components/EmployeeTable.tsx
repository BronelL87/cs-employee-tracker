'use client'

import { Employee } from '@/lib/interfaces/interfaces';
import { deleteEmployee, getEmployees } from '@/lib/services/employee-service';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from './ui/table';
import EmployeeModal from './EmployeeModal';
import { useAppContext } from '@/lib/context/context';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from './ui/pagination';

const EmployeeTable = () => {
    const { push } = useRouter();

    const { setEmployeeId } = useAppContext();

    // useStates
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);

    const [token, setToken] = useState('');

    const [sortBy, setSortBy] = useState("");
    const [sortByJob, setSortByJob] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const employeesPerPage = 5;

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const totalPages = Math.ceil(sortedEmployees.length / employeesPerPage);

    // const disabledOption1 = sortByJob == ""
    const disabledOption2 = sortByJob == "Customer Support"
    const disabledOption3 = sortByJob == "IT Support Specialist"
    const disabledOption4 = sortByJob == "Software Engineer"

    // Function to get employees
    const handleGetEmployees = async () => {
        try {
            const result: Employee[] | "Not Authorized" = await getEmployees(token);
            // const result: Employee[] | "Not Authorized" = [];
            if (result.toString() === "Not Authorized") {
                localStorage.setItem("Not Authorized", 'true');
                push("/login");
            }

            setEmployees(result as Employee[]);
        } catch (error) {
            console.log("error", error);
        }
    };

    // Updating sort functions
    const changeSortBy = (value: string) => {
            setSortBy(value);    

        if (sortByJob) {
            setSortByJob("");
        }
    };

    const changeSortByJob = (value: string) => {
        setSortBy("job-title");

        setSortByJob(value);
    };

    // Delete employee
    const handleDeleteEmployee = async (id: number) => {
        try {
            if (await deleteEmployee(token, id)) {
                await handleGetEmployees();
            }
        } catch (error) {
            console.log("error", error);
        }
    };

    const handleViewEmployee = async (id: number) => {
        push(`/employee-page/${id}`);
    };

    // Getting the user token from storage
    useEffect(() => {
        const handleToken = async () => {
            if (localStorage.getItem('user')) {
                setToken(await JSON.parse(localStorage.getItem('user')!).token);
            }
            if (sessionStorage.getItem('user')) {
                setToken(await JSON.parse(sessionStorage.getItem('user')!).token);
            }
        }

        handleToken();
    }, []);

    // Fetching employees after token is set
    useEffect(() => {
        if (token !== '') {
            handleGetEmployees();
        }
    }, [token])

    // Sorting the employees
    useEffect(() => {
        let sortingEmployees = [...employees];

        const handleSorting = () => {
            switch (sortBy) {
                case "name":
                    sortingEmployees.sort((a: Employee, b: Employee) => a.name.localeCompare(b.name));
                    break;
                case "name-reverse":
                    sortingEmployees.sort((a: Employee, b: Employee) => b.name.localeCompare(a.name));
                    break;
                case "hire-date":
                    sortingEmployees.sort(
                        (a: Employee, b: Employee) => Number(new Date(b.hireDate)) - Number(new Date(a.hireDate))
                    );
                    break;
                case "hire-date-reverse":
                    sortingEmployees.sort(
                        (a: Employee, b: Employee) => Number(new Date(a.hireDate)) - Number(new Date(b.hireDate))
                    );
                    break;
                case "job-title":
                    sortingEmployees = sortingEmployees.filter((employee: Employee) => employee.jobTitle == sortByJob);
                    break;
                default:
                    sortingEmployees.sort((a: Employee, b: Employee) => a.id - b.id);
                    break;
            }
            setSortedEmployees(sortingEmployees);
        };

        handleSorting();

    }, [employees, sortBy, sortByJob]);

    return (
        <>
            {/* Sort by - Start */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 p-4">
                <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <h2 className="text-2xl font-medium text-gray-700 dark:text-white">Add new hire</h2>
                    <EmployeeModal type="Add" employee={null} refreshEmployees={handleGetEmployees} />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center">
                        <p className="mr-2 text-sm text-gray-600">Sort by:</p>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm text-gray-600">
                                    Name
                                    {sortBy === "name" ? <FaCaretDown className="ml-2" /> : sortBy === "name-reverse" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => changeSortBy("name")}>A-Z</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeSortBy("name-reverse")}>Z-A</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="text-sm text-gray-600">
                                    Hire date
                                    {sortBy === "hire-date" ? <FaCaretDown className="ml-2" /> : sortBy === "hire-date-reverse" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => changeSortBy("hire-date")}>Newest First</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeSortBy("hire-date-reverse")}>Oldest First</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className='ml-3 text-sm border rounded p-1'>
                                    Job title
                                    {sortBy === "job-title" ? <FaCaretDown className="ml-2" /> : sortByJob === "" ? <FaCaretUp className="ml-2" /> : ""}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem onClick={() => changeSortByJob("Customer Support")}>Customer Support</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeSortByJob("IT Support Specialist")}>IT Support Specialist</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => changeSortByJob("Software Engineer")}>Software Engineer</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
            {/* Sort by - End */}

            {/* Display table - Start */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-lg'>Employee name</TableHead>
                        <TableHead className='text-lg'>Job Title</TableHead>
                        <TableHead className='text-lg'>Date Hired</TableHead>
                        <TableHead className="text-lg text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentEmployees.length === 0 ? (
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell className="text-center">
                                No Employees
                            </TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    ) : (
                        currentEmployees.map((employee, idx) => (
                            <TableRow key={idx}>
                                <TableCell className="font-medium">{employee.name}</TableCell>
                                <TableCell>{employee.jobTitle}</TableCell>
                                <TableCell>{employee.hireDate}</TableCell>
                                <TableCell className="flex gap-3 justify-end">
                                    <Button onClick={() => handleViewEmployee(employee.id)}>
                                        View
                                    </Button>
                                    <EmployeeModal type="Edit" employee={employee} refreshEmployees={handleGetEmployees} />
                                    <Button variant="destructive" onClick={() => handleDeleteEmployee(employee.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        {totalPages > 1 && (
        <Pagination className="mt-4">
        <PaginationContent>
        <PaginationItem>
        <PaginationPrevious
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
        />
      </PaginationItem>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <PaginationItem key={pageNum}>
          <PaginationLink
            isActive={currentPage === pageNum}
            onClick={() => setCurrentPage(pageNum)}
          >
            {pageNum}
          </PaginationLink>
        </PaginationItem>
        ))}

        <PaginationItem>
            <PaginationNext
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
            </PaginationItem>
            </PaginationContent>
        </Pagination>
        )}
        {/* Display table - End */}
        </>
    )
}

export default EmployeeTable