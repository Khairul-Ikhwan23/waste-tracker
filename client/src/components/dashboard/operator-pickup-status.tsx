import { useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, MapPin, Truck } from "lucide-react";
import { samplePickupRequests } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function OperatorPickupStatus() {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Only show this component for Waste Operators
  if (currentUser.role !== 'Waste Operator') {
    return null;
  }

  const handleStatusUpdate = () => {
    if (!selectedRequest || !status) {
      toast({
        title: "Missing Information",
        description: "Please select a pickup request and status",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status Updated",
      description: `Pickup request ${selectedRequest} marked as ${status}`,
    });

    // Reset form
    setSelectedRequest('');
    setStatus('');
    setNotes('');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'missed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'missed': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = samplePickupRequests.filter(req => req.status === 'pending' || req.status === 'scheduled');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Truck className="w-5 h-5 mr-2 text-green-primary" />
          Update Pickup Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Route Summary */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Today's Route Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Total: <span className="font-bold">24</span></p>
            </div>
            <div>
              <p className="text-green-700">Completed: <span className="font-bold">18</span></p>
            </div>
            <div>
              <p className="text-yellow-700">Pending: <span className="font-bold">6</span></p>
            </div>
          </div>
        </div>

        {/* Status Update Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Pickup Request
            </label>
            <Select value={selectedRequest} onValueChange={setSelectedRequest}>
              <SelectTrigger className="mobile-touch-target">
                <SelectValue placeholder="Choose a pickup request" />
              </SelectTrigger>
              <SelectContent>
                {pendingRequests.map((request) => (
                  <SelectItem key={request.id} value={request.id} className="mobile-touch-target">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{request.name}</p>
                          <p className="text-sm text-gray-600">{request.address}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="mobile-touch-target">
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed" className="mobile-touch-target">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Completed</span>
                  </div>
                </SelectItem>
                <SelectItem value="missed" className="mobile-touch-target">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Missed</span>
                  </div>
                </SelectItem>
                <SelectItem value="pending" className="mobile-touch-target">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600" />
                    <span>Pending</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this pickup..."
              className="mobile-touch-target"
              rows={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleStatusUpdate}
              className="green-primary hover:bg-green-600 text-white mobile-touch-target"
            >
              Update Status
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedRequest('');
                setStatus('');
                setNotes('');
              }}
              className="mobile-touch-target"
            >
              Reset Form
            </Button>
          </div>
        </div>

        {/* Current Location */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <h4 className="font-medium text-gray-900 mb-2">Current Location</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Kiulap Plaza, Brunei-Muara</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}