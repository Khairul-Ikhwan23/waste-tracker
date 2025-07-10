import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Menu, BarChart3, Users, Recycle, Award, TrendingUp } from "lucide-react";
import { sampleWasteMetrics, WASTE_TYPES, BRUNEI_DISTRICTS, type WasteMetric } from "@/lib/data";

export default function RecyclingMetrics() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const [selectedWasteType, setSelectedWasteType] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const filteredMetrics = sampleWasteMetrics.filter(metric => {
    if (selectedWasteType !== 'all' && metric.wasteType !== selectedWasteType) return false;
    if (selectedDistrict !== 'all' && metric.district !== selectedDistrict) return false;
    return true;
  });

  const totalVolume = filteredMetrics.reduce((sum, metric) => sum + metric.volume, 0);
  const recycledVolume = filteredMetrics.filter(m => m.recycled).reduce((sum, metric) => sum + metric.volume, 0);
  const recyclingRate = totalVolume > 0 ? Math.round((recycledVolume / totalVolume) * 100) : 0;

  // Calculate metrics by waste type
  const wasteTypeMetrics = WASTE_TYPES.map(type => {
    const typeMetrics = filteredMetrics.filter(m => m.wasteType === type);
    const typeTotal = typeMetrics.reduce((sum, metric) => sum + metric.volume, 0);
    const typeRecycled = typeMetrics.filter(m => m.recycled).reduce((sum, metric) => sum + metric.volume, 0);
    const typeRate = typeTotal > 0 ? Math.round((typeRecycled / typeTotal) * 100) : 0;
    
    return {
      type,
      total: typeTotal,
      recycled: typeRecycled,
      rate: typeRate
    };
  }).filter(item => item.total > 0);

  // Find most recycled waste type
  const mostRecycledType = wasteTypeMetrics.reduce((prev, current) => 
    prev.recycled > current.recycled ? prev : current
  );

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'Household': return 'bg-blue-100 text-blue-800';
      case 'Business': return 'bg-purple-100 text-purple-800';
      case 'Waste Operator': return 'bg-green-100 text-green-800';
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white shadow-md"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

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
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="ml-12 lg:ml-0">
                  <h1 className="text-2xl font-bold text-gray-900">Recycling Metrics</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Monitor recycling performance and environmental impact
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Select value={selectedWasteType} onValueChange={setSelectedWasteType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Waste Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Waste Types</SelectItem>
                    {WASTE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Districts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {BRUNEI_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 green-light rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Volume</p>
                    <p className="text-2xl font-bold text-gray-900">{totalVolume}kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 green-light rounded-lg">
                    <Recycle className="w-6 h-6 text-green-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recycled</p>
                    <p className="text-2xl font-bold text-gray-900">{recycledVolume}kg</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 green-light rounded-lg">
                    <TrendingUp className="w-6 h-6 text-green-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Recycling Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{recyclingRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 green-light rounded-lg">
                    <Award className="w-6 h-6 text-green-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Most Recycled</p>
                    <p className="text-lg font-bold text-gray-900">
                      {mostRecycledType?.type.replace(' (Municipal Solid Waste)', '') || 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Waste Type Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-green-primary" />
                  Waste Type Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wasteTypeMetrics.map((item) => (
                    <div key={item.type} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Badge className={getWasteTypeColor(item.type)}>
                          {item.type.replace(' (Municipal Solid Waste)', '')}
                        </Badge>
                        <span className="text-sm font-medium text-gray-600">{item.rate}%</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Recycled: {item.recycled}kg</span>
                        <span>Total: {item.total}kg</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="green-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed Metrics Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-primary" />
                  Detailed Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-medium text-gray-600">User</th>
                        <th className="text-left p-2 font-medium text-gray-600">Type</th>
                        <th className="text-left p-2 font-medium text-gray-600">Volume</th>
                        <th className="text-left p-2 font-medium text-gray-600">Recycled</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMetrics.map((metric) => (
                        <tr key={metric.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div>
                              <p className="font-medium text-gray-900">{metric.user}</p>
                              <Badge className={getUserTypeColor(metric.userType)} variant="outline">
                                {metric.userType}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-2">
                            <Badge className={getWasteTypeColor(metric.wasteType)}>
                              {metric.wasteType.replace(' (Municipal Solid Waste)', '')}
                            </Badge>
                          </td>
                          <td className="p-2 font-medium">{metric.volume}kg</td>
                          <td className="p-2">
                            <Badge className={metric.recycled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                              {metric.recycled ? 'Yes' : 'No'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}