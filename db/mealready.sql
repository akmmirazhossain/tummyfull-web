-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 21, 2024 at 07:14 PM
-- Server version: 8.0.36
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mealready`
--

-- --------------------------------------------------------

--
-- Table structure for table `mrd_food`
--

CREATE TABLE `mrd_food` (
  `mrd_food_id` int NOT NULL,
  `mrd_food_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_food_price` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_food_img` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_food_type` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_food_desc` varchar(255) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_food`
--

INSERT INTO `mrd_food` (`mrd_food_id`, `mrd_food_name`, `mrd_food_price`, `mrd_food_img`, `mrd_food_type`, `mrd_food_desc`) VALUES
(1, 'Rui fish', '60', 'rui-curry.png', 'curry', ''),
(2, 'Pui bhaji', '20', 'pui-bhaji.png', 'bhaji', ''),
(3, 'Rice', '20', 'shada-bhaath.png', 'staple', 'najir shail'),
(4, 'Dal', '20', 'dal.png', 'dal', 'masoor dal'),
(5, 'Chicken bhuna', '60', 'chicken-bhuna.png', 'curry', 'broiler murgi'),
(6, 'Pumpkin', '20', 'pumpkin-bhaji.png', 'bhaji', ''),
(7, 'Mixed vegetables', '30', 'mixed-veg.png', 'bhaji', 'a mix of carrot, papaya, pumpkin, baby corn, etc'),
(8, 'Egg fried rice', '30', 'fried-rice.webp', 'staple', 'egg fried rice'),
(9, 'Gila kolija ', '50', 'gila-kolija.png', 'curry', 'broiler chicken, gila, kolija, legs, wings'),
(10, 'Bhendi nhaji', '20', 'bhendi-bhaji.png', 'bhaji', 'ladisfinger bhaji');

-- --------------------------------------------------------

--
-- Table structure for table `mrd_menu`
--

CREATE TABLE `mrd_menu` (
  `mrd_menu_id` int NOT NULL,
  `mrd_menu_day` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_menu_food_id` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_menu_period` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_menu_price_promotion` int NOT NULL,
  `mrd_menu_price` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_menu`
--

INSERT INTO `mrd_menu` (`mrd_menu_id`, `mrd_menu_day`, `mrd_menu_food_id`, `mrd_menu_period`, `mrd_menu_price_promotion`, `mrd_menu_price`) VALUES
(1, 'sun', '1,2,3,', 'lunch', 0, 110),
(2, 'sun', '5,6,7', 'dinner', 0, 105),
(3, 'mon', '2,7,1,', 'lunch', 0, 95),
(4, 'mon', '2,8,3', 'dinner', 0, 110),
(5, 'tue', '5,3,9', 'lunch', 0, 110),
(6, 'tue', '1,4,6,', 'dinner', 0, 105),
(7, 'wed', '1,6,2,3', 'lunch', 0, 110),
(8, 'wed', '7,2,4,3', 'dinner', 0, 100),
(9, 'thu', '2,5,8', 'lunch', 0, 110),
(10, 'thu', '9,3,1', 'dinner', 0, 95),
(11, 'fri', '5,2,8,', 'lunch', 0, 70),
(12, 'fri', '3,6,2', 'dinner', 0, 85),
(13, 'sat', '7,3,6', 'lunch', 0, 95),
(14, 'sat', '3,6,9,', 'dinner', 0, 110);

-- --------------------------------------------------------

--
-- Table structure for table `mrd_order`
--

CREATE TABLE `mrd_order` (
  `mrd_order_id` int NOT NULL,
  `mrd_order_user_id` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_menu_id` int NOT NULL,
  `mrd_order_quantity` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_total_price` int NOT NULL,
  `mrd_order_status` enum('pending','cancelled','delivered','unavailable') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_date` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_rating` int DEFAULT NULL,
  `mrd_order_feedback` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_order_date_insert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_order`
--

INSERT INTO `mrd_order` (`mrd_order_id`, `mrd_order_user_id`, `mrd_order_menu_id`, `mrd_order_quantity`, `mrd_order_total_price`, `mrd_order_status`, `mrd_order_date`, `mrd_order_rating`, `mrd_order_feedback`, `mrd_order_date_insert`) VALUES
(1, '1', 13, '4', 342, 'pending', '22nd Jun', NULL, NULL, '2024-06-21 20:40:34'),
(2, '1', 12, '3', 229, 'pending', '21st Jun', NULL, NULL, '2024-06-21 09:36:58'),
(3, '1', 14, '1', 110, 'pending', '22nd Jun', NULL, NULL, '2024-06-21 20:51:51');

-- --------------------------------------------------------

--
-- Table structure for table `mrd_setting`
--

CREATE TABLE `mrd_setting` (
  `mrd_setting_id` int NOT NULL,
  `mrd_setting_announcement` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_order_max_days` int NOT NULL,
  `mrd_setting_time_limit_lunch` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_time_limit_dinner` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_delivery_time_lunch` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_delivery_time_dinner` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_delivery_charge` varchar(5) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_quantity_min` int NOT NULL,
  `mrd_setting_quantity_max` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_setting`
--

INSERT INTO `mrd_setting` (`mrd_setting_id`, `mrd_setting_announcement`, `mrd_setting_order_max_days`, `mrd_setting_time_limit_lunch`, `mrd_setting_time_limit_dinner`, `mrd_setting_delivery_time_lunch`, `mrd_setting_delivery_time_dinner`, `mrd_setting_delivery_charge`, `mrd_setting_quantity_min`, `mrd_setting_quantity_max`) VALUES
(1, 'This is a test announcement', 60, '22:00', '23:00', '12 pm - 2:30 pm', '6 pm - 8:30 pm', '30', 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `mrd_user`
--

CREATE TABLE `mrd_user` (
  `mrd_user_id` int NOT NULL,
  `mrd_user_last_otp` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_otp_expiration` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_otp_attempts` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_session_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_group_id` int NOT NULL DEFAULT '0',
  `mrd_user_first_name` char(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_last_name` char(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_image_file_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_phone` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_verified` int NOT NULL DEFAULT '0',
  `mrd_user_email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_address` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_payment_phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_lunchbox` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_total_meal` int NOT NULL DEFAULT '0',
  `mrd_user_delivery_ask` int NOT NULL DEFAULT '0',
  `mrd_user_meal_size` varchar(4) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_credit` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_credit_to_pay` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_date_added` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_user`
--

INSERT INTO `mrd_user` (`mrd_user_id`, `mrd_user_last_otp`, `mrd_user_otp_expiration`, `mrd_user_otp_attempts`, `mrd_user_session_token`, `mrd_user_group_id`, `mrd_user_first_name`, `mrd_user_last_name`, `mrd_user_image_file_name`, `mrd_user_phone`, `mrd_user_verified`, `mrd_user_email`, `mrd_user_password`, `mrd_user_address`, `mrd_user_payment_phone`, `mrd_user_status`, `mrd_user_lunchbox`, `mrd_user_total_meal`, `mrd_user_delivery_ask`, `mrd_user_meal_size`, `mrd_user_credit`, `mrd_user_credit_to_pay`, `mrd_user_date_added`, `updated_at`) VALUES
(1, '$2y$12$DIQaa7UB4wus2VadjQPxR.3dgLJVH0tacyYrYbGc50kKkHjyLwxve', '2024-06-21 09:45:04', '0', '46743aeebdc5e2ca6455afe47f4f304083bed933fa919456898a24b7fc8e48f7', 1, 'AKM Miraz Hossain', 'Hossain', '3245t464.jpg', '01673692997', 0, 'akmmirazhossain@gmail.com', '$2y$12$Ha9G2nkjFnGr9oW4C3OxouVxiz4bz.F8iQCxwUJ0.XxTSVH/LCqoq', 'B4, House 124, Road 12, Block G', '01673692997', 'active', 'inactive', 50, 1, 'L', '1350', '2:245|3:587', '46232', '2024-06-21 03:40:04');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mrd_food`
--
ALTER TABLE `mrd_food`
  ADD PRIMARY KEY (`mrd_food_id`);

--
-- Indexes for table `mrd_menu`
--
ALTER TABLE `mrd_menu`
  ADD PRIMARY KEY (`mrd_menu_id`);

--
-- Indexes for table `mrd_order`
--
ALTER TABLE `mrd_order`
  ADD PRIMARY KEY (`mrd_order_id`);

--
-- Indexes for table `mrd_setting`
--
ALTER TABLE `mrd_setting`
  ADD PRIMARY KEY (`mrd_setting_id`);

--
-- Indexes for table `mrd_user`
--
ALTER TABLE `mrd_user`
  ADD PRIMARY KEY (`mrd_user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `mrd_food`
--
ALTER TABLE `mrd_food`
  MODIFY `mrd_food_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mrd_menu`
--
ALTER TABLE `mrd_menu`
  MODIFY `mrd_menu_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `mrd_order`
--
ALTER TABLE `mrd_order`
  MODIFY `mrd_order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mrd_setting`
--
ALTER TABLE `mrd_setting`
  MODIFY `mrd_setting_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mrd_user`
--
ALTER TABLE `mrd_user`
  MODIFY `mrd_user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
