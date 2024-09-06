"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { markAttendance } from '../_lib/actions';

interface Participant {
    id: string;
    email: string | null;
    attended: boolean;
    firstName: string | null;
    isGuest: boolean;
}

interface ViewAllParticipantDialogProps {
    participants: Participant[];
}

export function ViewAllParticipantDialog({ participants }: ViewAllParticipantDialogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredParticipants, setFilteredParticipants] = useState(participants);

    const { eventId, id } = useParams();

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const term = event.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredParticipants(
            participants.filter((participant) =>
                participant.email?.toLowerCase().includes(term) ||
                participant.firstName?.toLowerCase().includes(term)
            )
        );
    };

    useEffect(() => {
        setFilteredParticipants(participants);
    }, [participants]);

    const handleAttendanceChange = async (participantId: string, attended: boolean, isGuest: boolean) => {

        const res = await markAttendance({
            eventId: eventId as string,
            participantId: participantId,
            attended: attended,
            orgId: id as string,
            isGuest: isGuest,
        });

        if (res.error) {
            toast.error(res.error);
            return 
        }

        setFilteredParticipants(prevParticipants =>
            prevParticipants.map(participant =>
                participant.id === participantId
                    ? { ...participant, attended }
                    : participant
            )
        );

        toast.success("Attendance updated");
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">View All Participants</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>All Participants</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 mb-4">
                    <Search className="w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search by email or name"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="flex-grow"
                    />
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Attended</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredParticipants.map((participant) => (
                                <TableRow key={participant.id}>
                                    <TableCell>{participant.email}</TableCell>
                                    <TableCell>{participant.firstName}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={participant.attended}
                                            onCheckedChange={(checked) => handleAttendanceChange(participant.id, checked, participant.isGuest)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
}
