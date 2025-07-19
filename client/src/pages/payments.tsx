import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Menu, CreditCard, Plus, Calendar, DollarSign, Filter, Search, Download, AlertCircle, CheckCircle, Clock, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPaymentSchema, type InsertPayment, type Payment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Payments() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const form = useForm<InsertPayment>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues: {
      amount: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      status: "pending",
      type: "pickup",
      method: "card",
      reference: "",
      dueDate: null,
    },
  });

  // Hardcoded payment data
  const hardcodedPayments: Payment[] = [
    {
      id: 1,
      amount: "125.50",
      date: "2025-01-15",
      description: "Monthly waste collection service",
      status: "completed",
      type: "subscription",
      method: "card",
      reference: "TXN001234",
      dueDate: "2025-01-15",
      createdAt: new Date("2025-01-15")
    },
    {
      id: 2,
      amount: "75.00",
      date: "2025-01-12",
      description: "Recycling bonus payment",
      status: "pending",
      type: "refund",
      method: "bank_transfer",
      reference: "REF567890",
      dueDate: "2025-01-20",
      createdAt: new Date("2025-01-12")
    },
    {
      id: 3,
      amount: "200.00",
      date: "2025-01-10",
      description: "Bulk waste disposal fee",
      status: "completed",
      type: "pickup",
      method: "digital_wallet",
      reference: "TXN002468",
      dueDate: "2025-01-10",
      createdAt: new Date("2025-01-10")
    },
    {
      id: 4,
      amount: "45.25",
      date: "2025-01-08",
      description: "Electronic waste processing",
      status: "failed",
      type: "pickup",
      method: "card",
      reference: "TXN003691",
      dueDate: "2025-01-08",
      createdAt: new Date("2025-01-08")
    },
    {
      id: 5,
      amount: "90.00",
      date: "2025-01-05",
      description: "Commercial waste pickup",
      status: "completed",
      type: "pickup",
      method: "cash",
      reference: "TXN004820",
      dueDate: "2025-01-05",
      createdAt: new Date("2025-01-05")
    },
    {
      id: 6,
      amount: "50.00",
      date: "2025-01-03",
      description: "Late payment penalty",
      status: "pending",
      type: "penalty",
      method: "card",
      reference: "PEN001234",
      dueDate: "2025-01-25",
      createdAt: new Date("2025-01-03")
    },
    {
      id: 7,
      amount: "180.00",
      date: "2025-01-01",
      description: "Quarterly subscription fee",
      status: "completed",
      type: "subscription",
      method: "bank_transfer",
      reference: "SUB987654",
      dueDate: "2025-01-01",
      createdAt: new Date("2025-01-01")
    },
    {
      id: 8,
      amount: "25.00",
      date: "2024-12-28",
      description: "Express pickup service",
      status: "cancelled",
      type: "pickup",
      method: "digital_wallet",
      reference: "EXP147258",
      dueDate: "2024-12-28",
      createdAt: new Date("2024-12-28")
    }
  ];

  const [localPayments, setLocalPayments] = useState<Payment[]>(hardcodedPayments);

  const addPaymentMutation = useMutation({
    mutationFn: async (data: InsertPayment) => {
      // Simulate API call with local state update
      const newPayment: Payment = {
        ...data,
        id: Math.max(...localPayments.map(p => p.id)) + 1,
        createdAt: new Date(),
      };
      setLocalPayments(prev => [newPayment, ...prev]);
      return newPayment;
    },
    onSuccess: () => {
      form.reset();
      toast({
        title: "Payment Added",
        description: "Payment record has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add payment record.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPayment) => {
    addPaymentMutation.mutate(data);
  };

  const payments: Payment[] = localPayments;

  // Filter and search functionality
  const filteredPayments = payments.filter(payment => {
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesType = filterType === "all" || payment.type === filterType;
    const matchesSearch = searchQuery === "" || 
      payment.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.reference?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pickup': return 'bg-blue-100 text-blue-800';
      case 'subscription': return 'bg-purple-100 text-purple-800';
      case 'penalty': return 'bg-red-100 text-red-800';
      case 'refund': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatMethod = (method: string) => {
    switch (method) {
      case 'card': return 'Credit/Debit Card';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash': return 'Cash';
      case 'digital_wallet': return 'Digital Wallet';
      default: return method;
    }
  };

  // Calculate summary statistics
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const pendingAmount = filteredPayments
    .filter(payment => payment.status === 'pending')
    .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);
  const completedCount = filteredPayments.filter(payment => payment.status === 'completed').length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {/* Overlay for mobile */}
      {isMobileMenuOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between min-h-16 py-2 sm:py-0">
              <div className="flex items-center flex-1 min-w-0 pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden mr-3 flex-shrink-0"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Payments</h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 hidden sm:block">
                    Manage and track payment records
                  </p>
                  <p className="text-xs text-gray-600 mt-1 sm:hidden">
                    Payment records
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">${pendingAmount.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{completedCount}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add New Payment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="w-5 h-5 mr-2 text-green-primary" />
                  Add New Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...form.register("amount")}
                        className="mt-1"
                      />
                      {form.formState.errors.amount && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.amount.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        {...form.register("date")}
                        className="mt-1"
                      />
                      {form.formState.errors.date && (
                        <p className="text-sm text-red-600 mt-1">
                          {form.formState.errors.date.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select onValueChange={(value) => form.setValue("type", value as any)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="penalty">Penalty</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="method">Payment Method</Label>
                      <Select onValueChange={(value) => form.setValue("method", value as any)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="digital_wallet">Digital Wallet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reference">Reference Number (Optional)</Label>
                    <Input
                      id="reference"
                      placeholder="TXN123456"
                      {...form.register("reference")}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Payment description"
                      {...form.register("description")}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full green-primary text-white hover:bg-green-600"
                    disabled={addPaymentMutation.isPending}
                  >
                    {addPaymentMutation.isPending ? "Adding..." : "Add Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Payment List */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters and Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                          placeholder="Search payments..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="pickup">Pickup</SelectItem>
                          <SelectItem value="subscription">Subscription</SelectItem>
                          <SelectItem value="penalty">Penalty</SelectItem>
                          <SelectItem value="refund">Refund</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button variant="outline" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-primary" />
                      Payment Records ({filteredPayments.length})
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentsQuery.isLoading ? (
                    <div className="text-center py-8 text-gray-500">
                      Loading payments...
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No payments found matching your criteria
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredPayments.map((payment) => (
                        <div
                          key={payment.id}
                          className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedPayment(payment)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="font-semibold text-lg text-gray-900">
                                ${parseFloat(payment.amount).toFixed(2)}
                              </div>
                              <Badge className={getStatusColor(payment.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(payment.status)}
                                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                </div>
                              </Badge>
                              <Badge className={getTypeColor(payment.type)}>
                                {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                              </Badge>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-900">
                              {payment.description || 'No description'}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatMethod(payment.method || 'card')}</span>
                              <span>Date: {payment.date}</span>
                            </div>
                            {payment.reference && (
                              <p className="text-xs text-gray-400">
                                Ref: {payment.reference}
                              </p>
                            )}
                            {payment.dueDate && payment.status === 'pending' && (
                              <p className="text-xs text-orange-600">
                                Due: {payment.dueDate}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Detail Modal - Simple version for now */}
          {selectedPayment && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Payment Details
                    <Button variant="ghost" size="sm" onClick={() => setSelectedPayment(null)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      ${parseFloat(selectedPayment.amount).toFixed(2)}
                    </div>
                    <Badge className={getStatusColor(selectedPayment.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(selectedPayment.status)}
                        {selectedPayment.status.charAt(0).toUpperCase() + selectedPayment.status.slice(1)}
                      </div>
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span>
                      <Badge className={getTypeColor(selectedPayment.type)}>
                        {selectedPayment.type.charAt(0).toUpperCase() + selectedPayment.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Method:</span>
                      <span>{formatMethod(selectedPayment.method || 'card')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span>
                      <span>{selectedPayment.date}</span>
                    </div>
                    {selectedPayment.reference && (
                      <div className="flex justify-between">
                        <span className="font-medium">Reference:</span>
                        <span className="font-mono text-sm">{selectedPayment.reference}</span>
                      </div>
                    )}
                    {selectedPayment.dueDate && (
                      <div className="flex justify-between">
                        <span className="font-medium">Due Date:</span>
                        <span>{selectedPayment.dueDate}</span>
                      </div>
                    )}
                  </div>
                  
                  {selectedPayment.description && (
                    <div>
                      <span className="font-medium">Description:</span>
                      <p className="text-gray-600 mt-1">{selectedPayment.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}