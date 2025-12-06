"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  PieChart,
  Calendar,
  Filter,
  Download,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Target,
  PiggyBank,
} from "lucide-react";
import {
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Dados mockados
const monthlyRevenueData = [
  { month: "Jan", revenue: 4200, expenses: 3200 },
  { month: "Fev", revenue: 5200, expenses: 3800 },
  { month: "Mar", revenue: 6100, expenses: 4200 },
  { month: "Abr", revenue: 7800, expenses: 3900 },
  { month: "Mai", revenue: 8900, expenses: 4500 },
  { month: "Jun", revenue: 9500, expenses: 5200 },
  { month: "Jul", revenue: 10200, expenses: 5800 },
];

const categoryData = [
  { name: "Alimentação", value: 25, color: "#3b82f6" },
  { name: "Transporte", value: 20, color: "#10b981" },
  { name: "Moradia", value: 30, color: "#8b5cf6" },
  { name: "Lazer", value: 15, color: "#f59e0b" },
  { name: "Saúde", value: 10, color: "#ef4444" },
];

const recentTransactions = [
  {
    id: 1,
    description: "Supermercado",
    category: "Alimentação",
    amount: -150.75,
    date: "10/11",
    type: "expense",
  },
  {
    id: 2,
    description: "Salário",
    category: "Renda",
    amount: 3500.0,
    date: "05/11",
    type: "income",
  },
  {
    id: 3,
    description: "Combustível",
    category: "Transporte",
    amount: -200.0,
    date: "08/11",
    type: "expense",
  },
  {
    id: 4,
    description: "Aluguel",
    category: "Moradia",
    amount: -1200.0,
    date: "01/11",
    type: "expense",
  },
  {
    id: 5,
    description: "Freelance",
    category: "Renda",
    amount: 800.0,
    date: "12/11",
    type: "income",
  },
  {
    id: 6,
    description: "Academia",
    category: "Saúde",
    amount: -89.9,
    date: "03/11",
    type: "expense",
  },
];

const financialMetrics = [
  {
    title: "Receita Mensal",
    value: "R$ 9.500",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    title: "Despesas Mensais",
    value: "R$ 5.200",
    change: "-3.2%",
    trend: "down",
    icon: CreditCard,
    color: "bg-green-500",
  },
  {
    title: "Saldo Atual",
    value: "R$ 12.340",
    change: "+8.7%",
    trend: "up",
    icon: Wallet,
    color: "bg-purple-500",
  },
  {
    title: "Meta de Economia",
    value: "75%",
    change: "+15%",
    trend: "up",
    icon: Target,
    color: "bg-orange-500",
  },
];

const investmentData = [
  { name: "Tesouro Direto", value: 40, amount: "R$ 4.000" },
  { name: "Ações", value: 30, amount: "R$ 3.000" },
  { name: "FIIs", value: 20, amount: "R$ 2.000" },
  { name: "CDB", value: 10, amount: "R$ 1.000" },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const totalIncome = recentTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = recentTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const savingsRate = (
    ((totalIncome - totalExpenses) / totalIncome) *
    100
  ).toFixed(1);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Carregando dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Dashboard Financeiro
          </h1>
          <p className="text-muted-foreground">
            Bem-vindo de volta! Aqui está o resumo das suas finanças.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Último mês</SelectItem>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="6m">6 meses</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Métricas Financeiras */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {financialMetrics.map((metric, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${metric.color}`}>
                <metric.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center pt-2 text-xs">
                {metric.trend === "up" ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={
                    metric.trend === "up" ? "text-green-500" : "text-red-500"
                  }
                >
                  {metric.change}
                </span>
                <span className="text-muted-foreground ml-2">
                  vs último mês
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos e Análises */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Receita vs Despesas */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Receita vs Despesas</CardTitle>
                <CardDescription>
                  Comparativo mensal dos últimos 6 meses
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Receita"
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expenses"
                    stroke="#ef4444"
                    strokeWidth={2}
                    name="Despesas"
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Distribuição por Categoria */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribuição por Categoria</CardTitle>
            <CardDescription>
              Como suas despesas estão distribuídas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      borderColor: "#374151",
                      borderRadius: "8px",
                    }}
                    formatter={(value) => [`${value}%`, "Porcentagem"]}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transações Recentes e Outros Dados */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Transações Recentes */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transações Recentes</CardTitle>
                <CardDescription>Suas últimas 6 transações</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === "income"
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-red-100 dark:bg-red-900/20"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span>{transaction.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}R${" "}
                      {Math.abs(transaction.amount).toFixed(2)}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Análise de Investimentos e Metas */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Investimentos & Metas</CardTitle>
            <CardDescription>Resumo dos seus investimentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Distribuição de Investimentos */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Portfólio de Investimentos</h3>
                <span className="text-sm text-muted-foreground">
                  Total: R$ 10.000
                </span>
              </div>
              <div className="space-y-3">
                {investmentData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-muted-foreground">
                        {item.amount}
                      </span>
                    </div>
                    <Progress value={item.value} className="h-2" />
                  </div>
                ))}
              </div>
            </div>

            {/* Meta de Economia */}
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Meta de Economia</h3>
                <Badge variant="secondary">{savingsRate}% alcançado</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <PiggyBank className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Meta: R$ 2.000/mês</span>
                    <span>R$ 1.500/mês</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
            </div>

            {/* Resumo Rápido */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Resumo Rápido</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-muted-foreground">Receita Total</p>
                  <p className="text-lg font-bold">
                    R$ {totalIncome.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <p className="text-sm text-muted-foreground">Despesa Total</p>
                  <p className="text-lg font-bold">
                    R$ {totalExpenses.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights e Dicas */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Insights Financeiros</CardTitle>
          <CardDescription>
            Recomendações baseadas nos seus dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Economia em Alta
              </h4>
              <p className="text-sm text-muted-foreground">
                Sua taxa de economia está {savingsRate}% acima da média.
                Continue assim!
              </p>
            </div>
            <div className="p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Gastos com Lazer
              </h4>
              <p className="text-sm text-muted-foreground">
                Gastos com lazer aumentaram 15%. Considere estabelecer um
                limite.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Diversificação
              </h4>
              <p className="text-sm text-muted-foreground">
                Seu portfólio está bem diversificado. Ótimo para mitigar riscos!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
