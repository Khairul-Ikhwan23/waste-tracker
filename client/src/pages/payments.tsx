import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Menu, CreditCard, Plus, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPaymentSchema, type InsertPayment, type Payment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Payments() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const form = useForm<InsertPayment>({
    resolver: zodResolver(insertPaymentSchema),
    defaultValues: {
      amount: "",
      date: new Date().toISOString().split('T')[0],
      description: "",
    },
  });

  const paymentsQuery = useQuery({
    queryKey: ["/api/payments"],
  });

  const addPaymentMutation = useMutation({
    mutationFn: (data: InsertPayment) => apiRequest("/api/payments", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
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

  const payments: Payment[] = paymentsQuery.data || [];

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
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden mr-2"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Manage and track payment records
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Payment description (optional)"
                      {...form.register("description")}
                      className="mt-1"
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-red-600 mt-1">
                        {form.formState.errors.description.message}
                      </p>
                    )}
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

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-primary" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {paymentsQuery.isLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading payments...
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No payments recorded yet
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-green-primary mr-2" />
                            <span className="font-semibold text-gray-900">
                              ${parseFloat(payment.amount).toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(payment.date).toLocaleDateString()}
                          </div>
                        </div>
                        {payment.description && (
                          <p className="text-sm text-gray-700">{payment.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}