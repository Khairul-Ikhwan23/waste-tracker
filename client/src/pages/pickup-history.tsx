import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Menu, History, Calendar, Filter, Download } from "lucide-react";
import { samplePickupHistory, WASTE_TYPES, type PickupHistory } from "@/lib/data";

export default function PickupHistoryPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const [filteredHistory, setFilteredHistory] = useState<PickupHistory[]>(samplePickupHistory);
  const [filterWasteType, setFilterWasteType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const applyFilters = () => {
    let filtered = samplePickupHistory;

    if (filterWasteType !== 'all') {
      filtered = filtered.filter(item => item.wasteType === filterWasteType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(item => item.status === filterStatus);
    }

    if (dateFrom) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(dateTo));
    }

    setFilteredHistory(filtered);
  };

  const clearFilters = () => {
    setFilterWasteType('all');
    setFilterStatus('all');
    setDateFrom('');
    setDateTo('');
    setFilteredHistory(samplePickupHistory);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Missed': return 'bg-red-100 text-red-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWasteTypeColor = (wasteType: string) => {
    switch (wasteType) {
      case 'MSW (Municipal Solid Waste)': return 'bg-red-100 text-red-800';
      case 'Recyclables': return 'bg-green-100 text-green-800';
      case 'Food Waste': return 'bg-orange-100 text-orange-800';
      case 'Bulky Waste': return 'bg-purple-100 text-purple-800';
      case 'Electronic Waste': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalVolume = filteredHistory.reduce((sum, item) => sum + item.volume, 0);
  const totalCarbonSaved = filteredHistory.reduce((sum, item) => sum + item.carbonSaved, 0);
  const completedPickups = filteredHistory.filter(item => item.status === 'Completed').length;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        isMobile={isMobile}
      />

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
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
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Pickup History</h1>
                  <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                    View your waste collection history and environmental impact
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

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-primary">{completedPickups}</p>
                  <p className="text-sm text-gray-600">Completed Pickups</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalVolume}kg</p>
                  <p className="text-sm text-gray-600">Total Volume</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{totalCarbonSaved.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">CO₂ Saved (kg)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2 text-green-primary" />
                Filter History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                  <Select value={filterWasteType} onValueChange={setFilterWasteType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {WASTE_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Missed">Missed</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
                
                <div className="flex items-end space-x-2">
                  <Button onClick={applyFilters} className="green-primary hover:bg-green-600 text-white">
                    Apply
                  </Button>
                  <Button onClick={clearFilters} variant="outline">
                    Clear
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* History Table/Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2 text-green-primary" />
                Pickup Records ({filteredHistory.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-gray-600">Date</th>
                      <th className="text-left p-3 font-medium text-gray-600">Waste Type</th>
                      <th className="text-left p-3 font-medium text-gray-600">Status</th>
                      <th className="text-left p-3 font-medium text-gray-600">Volume</th>
                      <th className="text-left p-3 font-medium text-gray-600">CO₂ Saved</th>
                      <th className="text-left p-3 font-medium text-gray-600">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((record) => (
                      <tr key={record.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                            {new Date(record.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getWasteTypeColor(record.wasteType)}>
                            {record.wasteType.replace(' (Municipal Solid Waste)', '')}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(record.status)}>
                            {record.status}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium">{record.volume}kg</td>
                        <td className="p-3 font-medium text-green-600">{record.carbonSaved}kg</td>
                        <td className="p-3 text-gray-600">{record.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredHistory.map((record) => (
                  <div key={record.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="font-medium">{new Date(record.date).toLocaleDateString()}</span>
                      </div>
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Waste Type:</span>
                        <Badge className={getWasteTypeColor(record.wasteType)}>
                          {record.wasteType.replace(' (Municipal Solid Waste)', '')}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Volume:</span>
                        <span className="font-medium">{record.volume}kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">CO₂ Saved:</span>
                        <span className="font-medium text-green-600">{record.carbonSaved}kg</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Location:</span>
                        <span className="text-sm">{record.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}