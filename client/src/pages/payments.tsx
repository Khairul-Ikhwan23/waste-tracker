import { useState } from "react";
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
import { samplePaymentRecords, type PaymentRecord } from "@/lib/data";

interface PaymentFormData {
  amount: string;
  date: string;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  type: 'pickup' | 'subscription' | 'penalty' | 'refund';
  method: 'card' | 'bank_transfer' | 'cash' | 'digital_wallet';
  reference: string;
  dueDate: string;
}

export default function Payments() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>(samplePaymentRecords);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: "",
    date: new Date().toISOString().split('T')[0],
    description: "",
    status: "pending",
    type: "pickup",
    method: "card",
    reference: "",
    dueDate: "",
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Create new payment record
    const newPayment: PaymentRecord = {
      id: (payments.length + 1).toString(),
      ...formData,
      dueDate: formData.dueDate || null,
      createdAt: new Date().toISOString(),
    };

    // Add to payments list
    setPayments([newPayment, ...payments]);

    // Reset form
    setFormData({
      amount: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
      status: "pending",
      type: "pickup",
      method: "card",
      reference: "",
      dueDate: "",
    });

    setIsSubmitting(false);
    toast({
      title: "Payment Added",
      description: "Payment record has been successfully added.",
    });
  };

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
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    Manage payment records and financial transactions
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-3 sm:px-6 lg:px-8 py-6 overflow-y-auto" style={{ height: 'calc(100vh - 80px)' }}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
                  <Plus className="w-5 h-5 mr-2 text-green-600" />
                  Add New Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value as PaymentFormData['type']})}>
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
                      <Select value={formData.method} onValueChange={(value) => setFormData({...formData, method: value as PaymentFormData['method']})}>
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
                    <Label htmlFor="reference">Reference Number</Label>
                    <Input
                      id="reference"
                      placeholder="Transaction reference"
                      value={formData.reference}
                      onChange={(e) => setFormData({...formData, reference: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date (Optional)</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Payment description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 text-white hover:bg-green-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding..." : "Add Payment"}
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
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Records */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                    Payment Records ({filteredPayments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4 max-h-96 overflow-y-auto overflow-x-hidden p-4">
                    {filteredPayments.map((payment) => (
                      <div key={payment.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors w-full">
                        <div className="flex items-start justify-between gap-3 w-full">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <DollarSign className="w-4 h-4 text-green-600" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <div className="font-semibold text-base text-gray-900">
                                  ${parseFloat(payment.amount).toFixed(2)}
                                </div>
                                <Badge className={`${getStatusColor(payment.status)} text-xs px-2 py-1`}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(payment.status)}
                                    <span className="truncate">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                                  </div>
                                </Badge>
                                <Badge className={`${getTypeColor(payment.type)} text-xs px-2 py-1`}>
                                  <span className="truncate">{payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}</span>
                                </Badge>
                              </div>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {payment.description || 'No description'}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs text-gray-500">
                                  <span className="truncate">{formatMethod(payment.method || 'card')}</span>
                                  <span className="truncate">{payment.date}</span>
                                  {payment.reference && (
                                    <span className="font-mono truncate">{payment.reference}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedPayment(payment)}
                            className="flex-shrink-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {filteredPayments.length === 0 && (
                      <div className="text-center py-8">
                        <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No payment records found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Payment Detail Modal */}
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
                      <p className="mt-1 text-sm text-gray-600">{selectedPayment.description}</p>
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