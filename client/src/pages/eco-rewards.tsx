import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUser } from "@/contexts/UserContext";
import Sidebar from "@/components/dashboard/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Menu, Gift, Star, Trophy, Crown } from "lucide-react";
import { sampleEcoRewards, ecoLeaderboard, type EcoReward } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

export default function EcoRewards() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { currentUser, updateProfile } = useUser();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Shopping', 'Food & Beverage', 'Entertainment', 'Merchandise', 'Environmental'];
  
  const filteredRewards = selectedCategory === 'all' 
    ? sampleEcoRewards 
    : sampleEcoRewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = (reward: EcoReward) => {
    if (currentUser.ecoPoints >= reward.pointsCost) {
      const newPoints = currentUser.ecoPoints - reward.pointsCost;
      updateProfile({ ecoPoints: newPoints });
      toast({
        title: "Reward Redeemed!",
        description: `You've successfully redeemed ${reward.title}`,
      });
    } else {
      toast({
        title: "Insufficient Points",
        description: `You need ${reward.pointsCost - currentUser.ecoPoints} more points to redeem this reward`,
        variant: "destructive",
      });
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />;
      case 3: return <Star className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3: return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default: return 'bg-gray-100';
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
                  <h1 className="text-2xl font-bold text-gray-900">EcoRewards</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Earn points for recycling and redeem amazing rewards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Points Balance */}
          <Card className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Your EcoPoints</h2>
                  <p className="text-3xl font-bold mt-2">{currentUser.ecoPoints}</p>
                  <p className="text-green-100 mt-1">Keep recycling to earn more!</p>
                </div>
                <div className="text-6xl opacity-20">
                  <Gift />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rewards Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Category Filter */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category ? "green-primary text-white" : ""}
                      >
                        {category === 'all' ? 'All Categories' : category}
                      </Button>
                    ))}
                  </div>

                  {/* Rewards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredRewards.map((reward) => (
                      <div 
                        key={reward.id} 
                        className={`p-4 border rounded-lg ${reward.available ? 'border-gray-200' : 'border-gray-300 bg-gray-50'}`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-3xl">{reward.icon}</div>
                          <Badge variant={reward.available ? "default" : "secondary"}>
                            {reward.available ? 'Available' : 'Out of Stock'}
                          </Badge>
                        </div>
                        
                        <h3 className="font-semibold text-gray-900 mb-1">{reward.title}</h3>
                        <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-bold text-lg">{reward.pointsCost}</span>
                            <span className="text-sm text-gray-600">points</span>
                          </div>
                          
                          <Button
                            size="sm"
                            onClick={() => handleRedeem(reward)}
                            disabled={!reward.available || currentUser.ecoPoints < reward.pointsCost}
                            className={
                              currentUser.ecoPoints >= reward.pointsCost && reward.available
                                ? "green-primary hover:bg-green-600 text-white"
                                : ""
                            }
                          >
                            {currentUser.ecoPoints >= reward.pointsCost && reward.available 
                              ? 'Redeem' 
                              : `Need ${reward.pointsCost - currentUser.ecoPoints} more`
                            }
                          </Button>
                        </div>
                        
                        {/* Progress bar for points needed */}
                        {currentUser.ecoPoints < reward.pointsCost && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress to unlock</span>
                              <span>{Math.round((currentUser.ecoPoints / reward.pointsCost) * 100)}%</span>
                            </div>
                            <Progress 
                              value={(currentUser.ecoPoints / reward.pointsCost) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leaderboard */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-green-primary" />
                    EcoPoints Leaderboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {ecoLeaderboard.map((user) => (
                      <div 
                        key={user.rank}
                        className={`flex items-center p-3 rounded-lg ${
                          user.name === currentUser.name ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getRankColor(user.rank)}`}>
                            {getRankIcon(user.rank)}
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${user.name === currentUser.name ? 'text-green-700' : 'text-gray-900'}`}>
                              {user.name}
                              {user.name === currentUser.name && <span className="text-sm ml-1">(You)</span>}
                            </p>
                            <p className="text-xs text-gray-600">{user.role}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">{user.points}</p>
                            <p className="text-xs text-gray-600">points</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Tip:</strong> Recycle more waste to climb the leaderboard and unlock exclusive rewards!
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Rewards Redeemed</span>
                      <span className="font-bold">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Lifetime Points Earned</span>
                      <span className="font-bold">1,240</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Rank</span>
                      <span className="font-bold">
                        #{ecoLeaderboard.find(u => u.name === currentUser.name)?.rank || 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}