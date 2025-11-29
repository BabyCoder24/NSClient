import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Skeleton,
  Fade,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AccountBalance,
  TrendingUp,
  ShoppingCart,
  CreditCard,
  Person,
  Email,
  LocationOn,
  Receipt,
  Notifications,
  Settings,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import PageContainer from "../components/PageContainer";

const accountStats = [
  {
    title: "Total Balance",
    value: "$12,450.00",
    change: "+2.5%",
    icon: <AccountBalance />,
    color: "primary",
  },
  {
    title: "Monthly Spending",
    value: "$2,340.00",
    change: "-5.2%",
    icon: <TrendingUp />,
    color: "success",
  },
  {
    title: "Active Orders",
    value: "8",
    change: "+3",
    icon: <ShoppingCart />,
    color: "warning",
  },
  {
    title: "Rewards Points",
    value: "1,250",
    change: "+150",
    icon: <CreditCard />,
    color: "info",
  },
];

const recentActivities = [
  {
    id: 1,
    action: "Purchase",
    description: "Office Supplies Order #12345",
    amount: "-$89.99",
    date: "2 hours ago",
    type: "expense",
  },
  {
    id: 2,
    action: "Payment",
    description: "Salary Deposit",
    amount: "+$3,500.00",
    date: "1 day ago",
    type: "income",
  },
  {
    id: 3,
    action: "Subscription",
    description: "Premium Plan Renewal",
    amount: "-$29.99",
    date: "3 days ago",
    type: "expense",
  },
  {
    id: 4,
    action: "Refund",
    description: "Product Return #67890",
    amount: "+$45.00",
    date: "5 days ago",
    type: "income",
  },
];

// Chart data
const spendingData = [
  { month: "Jan", amount: 1200 },
  { month: "Feb", amount: 1900 },
  { month: "Mar", amount: 800 },
  { month: "Apr", amount: 2780 },
  { month: "May", amount: 1890 },
  { month: "Jun", amount: 2390 },
];

const balanceData = [
  { name: "Checking", value: 4000, color: "#8884d8" },
  { name: "Savings", value: 3000, color: "#82ca9d" },
  { name: "Investment", value: 2000, color: "#ffc658" },
  { name: "Credit", value: 1000, color: "#ff7c7c" },
];

const Dashboard: React.FC = () => {
  const { user, role } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Set mounted after component mounts
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = user ? `${user.firstName} ${user.lastName}` : "User";
  const avatarInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";
  const userEmail = user?.email || "user@example.com";
  const accountType = role === "Administrator" ? "Admin" : "User";

  const quickActions = [
    {
      label: "View Profile",
      icon: <Person />,
      action: () => console.log("View Profile"),
    },
    {
      label: "Account Settings",
      icon: <Settings />,
      action: () => console.log("Account Settings"),
    },
    {
      label: "Transaction History",
      icon: <Receipt />,
      action: () => console.log("Transaction History"),
    },
    {
      label: "Notifications",
      icon: <Notifications />,
      action: () => console.log("Notifications"),
    },
    ...(role === "Administrator"
      ? [
          {
            label: "User Management",
            icon: <Person />,
            action: () => console.log("User Management"),
          },
        ]
      : []),
  ];

  return (
    <PageContainer
      title="Overview"
      maxWidth="xl"
      breadcrumbs={[
        { title: "Admin Dashboard", path: "/admin-dashboard/overview" },
        { title: "Overview" },
      ]}
    >
      <Stack spacing={4}>
        {/* Hero Header Section */}
        <Fade in={!loading} timeout={1000}>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 3,
              p: { xs: 3, sm: 4 },
              color: "white",
              position: "relative",
              overflow: "hidden",
              minHeight: 0,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
              },
            }}
          >
            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, typography: { xs: "h4", md: "h3" } }}
              >
                Welcome back, {displayName}!
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                Here's an overview of your {accountType.toLowerCase()} account
                activity
              </Typography>
              {role === "Administrator" && (
                <Chip
                  label="Administrator Access"
                  color="secondary"
                  variant="outlined"
                  sx={{
                    color: "white",
                    borderColor: "white",
                    "& .MuiChip-label": { fontWeight: 600 },
                  }}
                />
              )}
            </Box>
          </Box>
        </Fade>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {/* User Profile Card */}
          <Box sx={{ gridColumn: { xs: "1", md: "1" } }}>
            {loading ? (
              <Card sx={{ height: { xs: 300, md: 400 } }}>
                <CardContent sx={{ textAlign: "center", pt: 3 }}>
                  <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    sx={{ mx: "auto", mb: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "2rem", mx: "auto", mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={32}
                    sx={{ mx: "auto", mb: 2 }}
                  />
                  <Skeleton variant="text" sx={{ mx: "auto", mb: 1 }} />
                  <Skeleton variant="text" sx={{ mx: "auto", mb: 1 }} />
                  <Skeleton variant="text" sx={{ mx: "auto", mb: 1 }} />
                  <Skeleton variant="text" sx={{ mx: "auto" }} />
                </CardContent>
              </Card>
            ) : (
              <Fade in={!loading} timeout={1500}>
                <Card
                  sx={{
                    height: "100%",
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-8px)",
                      boxShadow: (theme) => theme.shadows[12],
                    },
                  }}
                  aria-label="User Profile"
                >
                  <CardContent
                    sx={{ textAlign: "center", pt: { xs: 2, md: 3 } }}
                  >
                    <Avatar
                      sx={{
                        width: { xs: 60, md: 80 },
                        height: { xs: 60, md: 80 },
                        mx: "auto",
                        mb: 2,
                        bgcolor: "primary.main",
                        fontSize: { xs: "1.5rem", md: "2rem" },
                        boxShadow: (theme) => theme.shadows[4],
                      }}
                    >
                      {avatarInitials}
                    </Avatar>
                    <Typography
                      variant={isMobile ? "subtitle1" : "h6"}
                      gutterBottom
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {displayName}
                    </Typography>
                    <Chip
                      label={accountType}
                      color="primary"
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Email
                          sx={{
                            mr: 1,
                            color: "text.secondary",
                            fontSize: 18,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {userEmail}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Person
                          sx={{
                            mr: 1,
                            color: "text.secondary",
                            fontSize: 18,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user?.username || "N/A"}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <LocationOn
                          sx={{
                            mr: 1,
                            color: "text.secondary",
                            fontSize: 18,
                          }}
                        />
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {user?.companyName || "N/A"}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 2, display: "block" }}
                    >
                      Welcome to NSolutions
                    </Typography>
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Box>

          {/* Account Statistics with Charts */}
          <Box sx={{ gridColumn: { xs: "1", md: "2" } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Statistics Cards */}
              {accountStats.map((stat, index) => (
                <Box key={index}>
                  {loading ? (
                    <Card>
                      <CardContent>
                        <Skeleton
                          variant="rectangular"
                          width={48}
                          height={48}
                          sx={{ mb: 1 }}
                        />
                        <Skeleton variant="text" sx={{ mb: 1 }} />
                        <Skeleton variant="text" sx={{ fontSize: "2rem" }} />
                        <Skeleton variant="text" width="60%" />
                      </CardContent>
                    </Card>
                  ) : (
                    <Fade in={!loading} timeout={1500 + index * 200}>
                      <Card
                        sx={{
                          background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                          transition:
                            "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: (theme) => theme.shadows[8],
                          },
                        }}
                        aria-label={`${stat.title} statistics`}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                bgcolor: `${stat.color}.light`,
                                color: `${stat.color}.main`,
                                mr: 2,
                              }}
                            >
                              {stat.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {stat.title}
                              </Typography>
                              <Typography
                                variant={isMobile ? "h6" : "h5"}
                                component="div"
                                sx={{
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {stat.value}
                              </Typography>
                            </Box>
                          </Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: stat.change.startsWith("+")
                                ? "success.main"
                                : "error.main",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {stat.change} from last month
                          </Typography>
                        </CardContent>
                      </Card>
                    </Fade>
                  )}
                </Box>
              ))}

              {/* Spending Chart */}
              <Box
                sx={{
                  gridColumn: {
                    xs: "1 / -1",
                    sm: "1 / -1",
                    md: "1 / -1",
                  },
                }}
              >
                {loading ? (
                  <Card>
                    <CardContent>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.5rem", mb: 2 }}
                      />
                      <Skeleton variant="rectangular" height={300} />
                    </CardContent>
                  </Card>
                ) : (
                  <Fade in={!loading} timeout={2000}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        transition:
                          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) => theme.shadows[8],
                        },
                      }}
                      aria-label="Monthly spending chart"
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Monthly Spending Trend
                        </Typography>
                        <Box sx={{ height: { xs: 200, md: 300 } }}>
                          {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={spendingData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                  type="monotone"
                                  dataKey="amount"
                                  stroke={theme.palette.primary.main}
                                  strokeWidth={2}
                                  dot={{
                                    fill: theme.palette.primary.main,
                                  }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                )}
              </Box>
            </Box>
          </Box>

          {/* Recent Activity */}
          <Box sx={{ gridColumn: { xs: "1", md: "1" } }}>
            {loading ? (
              <Card>
                <CardContent>
                  <Skeleton variant="text" sx={{ fontSize: "1.5rem", mb: 2 }} />
                  {[...Array(4)].map((_, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{ mr: 2 }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Skeleton variant="text" />
                        <Skeleton variant="text" width="60%" />
                      </Box>
                      <Skeleton variant="text" width={60} />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Fade in={!loading} timeout={2500}>
                <Card
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                    transition:
                      "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: (theme) => theme.shadows[8],
                    },
                  }}
                  aria-label="Recent activity list"
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Recent Activity
                    </Typography>
                    <List>
                      {recentActivities.map((activity, index) => (
                        <React.Fragment key={activity.id}>
                          <ListItem>
                            <ListItemIcon>
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1,
                                  bgcolor:
                                    activity.type === "income"
                                      ? "success.light"
                                      : "error.light",
                                  color:
                                    activity.type === "income"
                                      ? "success.main"
                                      : "error.main",
                                }}
                              >
                                {activity.type === "income" ? (
                                  <TrendingUp />
                                ) : (
                                  <Receipt />
                                )}
                              </Box>
                            </ListItemIcon>
                            <ListItemText
                              primary={activity.description}
                              secondary={activity.date}
                              primaryTypographyProps={{
                                noWrap: true,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                              secondaryTypographyProps={{
                                noWrap: true,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            />
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: "bold",
                                color:
                                  activity.type === "income"
                                    ? "success.main"
                                    : "error.main",
                                ml: 1,
                                flexShrink: 0,
                              }}
                              noWrap
                            >
                              {activity.amount}
                            </Typography>
                          </ListItem>
                          {index < recentActivities.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Fade>
            )}
          </Box>

          {/* Quick Actions & Goals */}
          <Box sx={{ gridColumn: { xs: "1", md: "2" } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr" },
                gap: { xs: 2, md: 3 },
              }}
            >
              {/* Quick Actions */}
              <Box>
                {loading ? (
                  <Card>
                    <CardContent>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.5rem", mb: 2 }}
                      />
                      {[...Array(4)].map((_, i) => (
                        <Skeleton
                          variant="rectangular"
                          height={36}
                          sx={{ mb: 1 }}
                          key={i}
                        />
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Fade in={!loading} timeout={3000}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        transition:
                          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) => theme.shadows[8],
                        },
                      }}
                      aria-label="Quick actions"
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Quick Actions
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                          }}
                        >
                          {quickActions.map((action, index) => (
                            <Button
                              key={index}
                              variant="outlined"
                              startIcon={action.icon}
                              onClick={action.action}
                              sx={{
                                justifyContent: "flex-start",
                                transition: "all 0.3s ease-in-out",
                                "&:hover": {
                                  transform: "translateX(4px)",
                                  boxShadow: (theme) => theme.shadows[4],
                                },
                              }}
                              aria-label={action.label}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                )}
              </Box>

              {/* Account Goals */}
              <Box>
                {loading ? (
                  <Card>
                    <CardContent>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.5rem", mb: 2 }}
                      />
                      {[...Array(3)].map((_, i) => (
                        <Box key={i} sx={{ mb: 2 }}>
                          <Skeleton variant="text" sx={{ mb: 1 }} />
                          <Skeleton variant="rectangular" height={8} />
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                ) : (
                  <Fade in={!loading} timeout={3500}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        transition:
                          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) => theme.shadows[8],
                        },
                      }}
                      aria-label="Account goals progress"
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Account Goals
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography variant="body2">
                              Monthly Savings
                            </Typography>
                            <Typography variant="body2">
                              $850 / $1,000
                            </Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={85} />
                        </Box>
                        <Box sx={{ mb: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography variant="body2">
                              Investment Target
                            </Typography>
                            <Typography variant="body2">
                              $5,200 / $10,000
                            </Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={52} />
                        </Box>
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              mb: 1,
                              flexWrap: "wrap",
                            }}
                          >
                            <Typography variant="body2">
                              Reward Points
                            </Typography>
                            <Typography variant="body2">
                              1,250 / 2,000
                            </Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={62.5} />
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                )}
              </Box>

              {/* Balance Distribution Chart */}
              <Box>
                {loading ? (
                  <Card>
                    <CardContent>
                      <Skeleton
                        variant="text"
                        sx={{ fontSize: "1.5rem", mb: 2 }}
                      />
                      <Skeleton variant="rectangular" height={300} />
                    </CardContent>
                  </Card>
                ) : (
                  <Fade in={!loading} timeout={4000}>
                    <Card
                      sx={{
                        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                        transition:
                          "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: (theme) => theme.shadows[8],
                        },
                      }}
                      aria-label="Balance distribution chart"
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Balance Distribution
                        </Typography>
                        <Box sx={{ height: { xs: 200, md: 300 } }}>
                          {mounted && (
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={balanceData}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={({ name, percent }) =>
                                    `${name} ${
                                      percent ? (percent * 100).toFixed(0) : 0
                                    }%`
                                  }
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {balanceData.map((entry, index) => (
                                    <Cell
                                      key={`cell-${index}`}
                                      fill={entry.color}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip />
                              </PieChart>
                            </ResponsiveContainer>
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Fade>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Stack>
    </PageContainer>
  );
};

export default Dashboard;
