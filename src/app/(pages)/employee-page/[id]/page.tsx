'use client'

import EmployeeEditView from '@/components/EmployeeEditView';
import EmployeeView from '@/components/EmployeeView';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Employee } from '@/lib/interfaces/interfaces';
import { getEmployeeById } from '@/lib/services/employee-service';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const page = () => {
    const params = useParams();
    const employeeId = Number(params.id);

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [token, setToken] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const handleToken = () => {
            const user = localStorage.getItem('user') || sessionStorage.getItem('user');
            if (user) {
                const parsed = JSON.parse(user);
                setToken(parsed.token);
            }
        };

        handleToken();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (token && employeeId) {
                const tempEmployee = await getEmployeeById(token, employeeId);
                if (tempEmployee) {
                    setEmployee(tempEmployee);
                }
            }
        };

        fetchEmployee();
    }, [token, employeeId]);

    return (
        <div className="min-h-screen flex flex-col justify-center max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-black">
                        {employee ? employee.name : 'No employee found'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-black">
                    {employee && (
                        isEditing ?
                            <EmployeeEditView employee={employee} setEdit={setIsEditing} />
                            :
                            <EmployeeView employee={employee} setEdit={setIsEditing} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default page;