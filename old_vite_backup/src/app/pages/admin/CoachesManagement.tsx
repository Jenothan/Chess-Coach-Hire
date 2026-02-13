import { useState } from 'react';
import { Check, X, Eye, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Input } from '../../components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { mockCoaches } from '../../data/mockData';
import { toast } from 'sonner';

export function CoachesManagement() {
  const [coaches, setCoaches] = useState(mockCoaches);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoach, setSelectedCoach] = useState<typeof mockCoaches[0] | null>(null);

  const filteredCoaches = coaches.filter(coach =>
    coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coach.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    setCoaches(coaches.map(coach =>
      coach.id === id ? { ...coach, status: 'approved' } : coach
    ));
    toast.success('Coach approved successfully');
  };

  const handleReject = (id: string) => {
    setCoaches(coaches.map(coach =>
      coach.id === id ? { ...coach, status: 'rejected' } : coach
    ));
    toast.error('Coach application rejected');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coaches Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and approve coach applications</p>
        </div>
        <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
          Add Coach
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search coaches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coach</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Reviews</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCoaches.map((coach) => (
                <TableRow key={coach.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={coach.avatar} />
                        <AvatarFallback>{coach.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{coach.name}</p>
                        <p className="text-sm text-gray-500">{coach.experience}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{coach.title}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{coach.rating}</TableCell>
                  <TableCell>{coach.students}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-600">★</span>
                      <span className="font-medium">{coach.reviews}</span>
                      <span className="text-gray-500">({coach.totalReviews})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={coach.status === 'approved' ? 'default' : 'secondary'}
                      className={
                        coach.status === 'approved'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }
                    >
                      {coach.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedCoach(coach)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {coach.status === 'pending' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(coach.id)}
                          >
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(coach.id)}
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Coach Details Dialog */}
      <Dialog open={!!selectedCoach} onOpenChange={() => setSelectedCoach(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Coach Details</DialogTitle>
            <DialogDescription>View complete coach profile and information</DialogDescription>
          </DialogHeader>
          {selectedCoach && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={selectedCoach.avatar} />
                  <AvatarFallback>{selectedCoach.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedCoach.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCoach.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge>Rating: {selectedCoach.rating}</Badge>
                    <Badge variant="outline">{selectedCoach.experience}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bio</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedCoach.bio}</p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCoach.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Languages</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCoach.languages.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Availability</h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedCoach.availability.join(', ')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Pricing</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Hourly: ${selectedCoach.hourlyRate}<br />
                    Monthly: ${selectedCoach.monthlyRate}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Statistics</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Students: {selectedCoach.students}<br />
                    Reviews: {selectedCoach.reviews} ★ ({selectedCoach.totalReviews})
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Certificates</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCoach.certificates.map((cert, index) => (
                    <Badge key={index}>{cert}</Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
