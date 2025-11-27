import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Person from "@mui/icons-material/Person";
import Work from "@mui/icons-material/Work";
import Cancel from "@mui/icons-material/Cancel";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, color }) => (
  <Card
    sx={{
      background: `linear-gradient(135deg, ${color} 0%, ${color} 100%)`,
      "&:hover": {
        transform: "translateY(-4px)",
        transition: "0.3s",
      },
      height: "100%",
    }}
  >
    <CardContent>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {icon}
        <Box sx={{ ml: 2 }}>
          <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const StatsCards: React.FC = () => {
  const { users } = useSelector((state: RootState) => state.users);

  const totalUsers = users.length;
  const verifiedUsers = users.filter((user) => user.isVerified).length;
  const activeUsers = users.filter((user) => user.isActive).length;
  const adminUsers = users.filter(
    (user) => user.roleName === "Administrator"
  ).length;
  const inactiveUsers = users.filter((user) => !user.isActive).length;

  const stats = [
    {
      icon: (
        <PeopleIcon
          sx={{ fontSize: { xs: 30, md: 40 }, color: "primary.main", mr: 2 }}
        />
      ),
      title: "Total Users",
      value: totalUsers,
      color: "#e3f2fd",
    },
    {
      icon: (
        <CheckCircle
          sx={{ fontSize: { xs: 30, md: 40 }, color: "success.main", mr: 2 }}
        />
      ),
      title: "Verified Users",
      value: verifiedUsers,
      color: "#e8f5e8",
    },
    {
      icon: (
        <Person
          sx={{ fontSize: { xs: 30, md: 40 }, color: "info.main", mr: 2 }}
        />
      ),
      title: "Active Users",
      value: activeUsers,
      color: "#e1f5fe",
    },
    {
      icon: (
        <Work
          sx={{ fontSize: { xs: 30, md: 40 }, color: "warning.main", mr: 2 }}
        />
      ),
      title: "Administrators",
      value: adminUsers,
      color: "#fff3e0",
    },
    {
      icon: (
        <Cancel
          sx={{ fontSize: { xs: 30, md: 40 }, color: "error.main", mr: 2 }}
        />
      ),
      title: "Inactive Users",
      value: inactiveUsers,
      color: "#ffebee",
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: { xs: 2, sm: 3, md: 4 },
        alignItems: "stretch",
      }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </Box>
  );
};

export default StatsCards;
