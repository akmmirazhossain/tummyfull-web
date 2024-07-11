-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jul 11, 2024 at 04:36 AM
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
-- Table structure for table `mrd_area`
--

CREATE TABLE `mrd_area` (
  `mrd_area_id` int NOT NULL,
  `mrd_area_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_area`
--

INSERT INTO `mrd_area` (`mrd_area_id`, `mrd_area_name`) VALUES
(1, 'Bashundhara R/A'),
(2, 'Wari');

-- --------------------------------------------------------

--
-- Table structure for table `mrd_delivery`
--

CREATE TABLE `mrd_delivery` (
  `mrd_delivery_id` int NOT NULL,
  `mrd_delivery_user_id` int DEFAULT NULL,
  `mrd_delivery_status` int DEFAULT NULL,
  `mrd_delivery_order_id` int DEFAULT NULL,
  `mrd_delivery_message_type` enum('update','alert','information','mealbox') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_delivery_message` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_delivery_date_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_delivery`
--

INSERT INTO `mrd_delivery` (`mrd_delivery_id`, `mrd_delivery_user_id`, `mrd_delivery_status`, `mrd_delivery_order_id`, `mrd_delivery_message_type`, `mrd_delivery_message`, `mrd_delivery_date_updated`) VALUES
(4, 1, 1, NULL, 'mealbox', 'mealbox activated', '2024-07-06 21:41:33'),
(5, 18, 1, NULL, 'mealbox', 'mealbox activated', '2024-07-06 06:22:59'),
(6, NULL, 0, NULL, 'mealbox', 'mealbox deactivated', '2024-07-03 04:36:50');

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
(1, 'Rui fish', '60', 'rui-curry.png', 'curry', 'Rui fish jhaal curry'),
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
-- Table structure for table `mrd_meal_log`
--

CREATE TABLE `mrd_meal_log` (
  `mrd_meal_log_id` int NOT NULL,
  `mrd_meal_log_user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mrd_menu`
--

CREATE TABLE `mrd_menu` (
  `mrd_menu_id` int NOT NULL,
  `mrd_menu_day` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_menu_food_id` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_menu_period` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_menu_price_promo` int NOT NULL,
  `mrd_menu_price` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_menu`
--

INSERT INTO `mrd_menu` (`mrd_menu_id`, `mrd_menu_day`, `mrd_menu_food_id`, `mrd_menu_period`, `mrd_menu_price_promo`, `mrd_menu_price`) VALUES
(1, 'sun', '1,2,3,', 'lunch', 110, 130),
(2, 'sun', '5,6,7', 'dinner', 100, 115),
(3, 'mon', '2,7,1,', 'lunch', 0, 120),
(4, 'mon', '2,8,3', 'dinner', 0, 110),
(5, 'tue', '5,3,9', 'lunch', 0, 110),
(6, 'tue', '1,4,6,', 'dinner', 0, 105),
(7, 'wed', '1,6,2,3', 'lunch', 0, 110),
(8, 'wed', '7,2,4,3', 'dinner', 0, 100),
(9, 'thu', '2,5,8', 'lunch', 0, 110),
(10, 'thu', '9,3,1', 'dinner', 0, 120),
(11, 'fri', '5,2,8,', 'lunch', 0, 105),
(12, 'fri', '3,6,2', 'dinner', 0, 125),
(13, 'sat', '7,3,6', 'lunch', 0, 95),
(14, 'sat', '3,6,9,', 'dinner', 0, 110);

-- --------------------------------------------------------

--
-- Table structure for table `mrd_notification`
--

CREATE TABLE `mrd_notification` (
  `mrd_notif_id` int NOT NULL,
  `mrd_notif_user_id` int NOT NULL,
  `mrd_notif_message` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_notif_type` enum('order','mealbox','delivery') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_notif_status` int NOT NULL DEFAULT '0',
  `mrd_notif_date_added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mrd_notif_data_updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mrd_order`
--

CREATE TABLE `mrd_order` (
  `mrd_order_id` int NOT NULL,
  `mrd_order_user_id` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_menu_id` int NOT NULL,
  `mrd_order_quantity` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_discount` int DEFAULT NULL,
  `mrd_order_total_price` int NOT NULL,
  `mrd_order_status` enum('pending','cancelled','delivered','unavailable') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_mealbox` int DEFAULT '0',
  `mrd_order_date` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_order_rating` int DEFAULT NULL,
  `mrd_order_feedback` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_order_date_insert` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_order`
--

INSERT INTO `mrd_order` (`mrd_order_id`, `mrd_order_user_id`, `mrd_order_menu_id`, `mrd_order_quantity`, `mrd_order_discount`, `mrd_order_total_price`, `mrd_order_status`, `mrd_order_mealbox`, `mrd_order_date`, `mrd_order_rating`, `mrd_order_feedback`, `mrd_order_date_insert`) VALUES
(1, '1', 1, '1', NULL, 130, 'pending', 1, '2024-07-07', NULL, NULL, '2024-07-06 12:06:24'),
(2, '1', 5, '1', NULL, 110, 'pending', 1, '2024-07-09', NULL, NULL, '2024-07-07 03:41:33'),
(3, '18', 13, '1', NULL, 95, 'pending', 1, '2024-07-06', NULL, NULL, '2024-07-06 09:19:12'),
(4, '18', 1, '1', NULL, 130, 'pending', 1, '2024-07-07', NULL, NULL, '2024-07-07 04:26:46'),
(5, '18', 3, '1', NULL, 120, 'cancelled', 1, '2024-07-08', NULL, NULL, '2024-07-06 12:29:41'),
(6, '1', 13, '1', NULL, 95, 'cancelled', 1, '2024-07-06', NULL, NULL, '2024-07-06 09:59:05'),
(7, '1', 14, '1', NULL, 110, 'cancelled', 1, '2024-07-06', NULL, NULL, '2024-07-06 09:59:13'),
(8, '1', 2, '1', NULL, 115, 'cancelled', 1, '2024-07-07', NULL, NULL, '2024-07-06 12:06:24'),
(9, '1', 4, '1', NULL, 110, 'pending', 1, '2024-07-08', NULL, NULL, '2024-07-07 03:41:33'),
(10, '1', 6, '1', NULL, 105, 'pending', 1, '2024-07-09', NULL, NULL, '2024-07-07 03:41:33'),
(11, '1', 8, '1', NULL, 100, 'pending', 1, '2024-07-10', NULL, NULL, '2024-07-07 03:41:33'),
(12, '18', 14, '1', NULL, 110, 'pending', 0, '2024-07-06', NULL, NULL, '2024-07-06 12:22:05'),
(13, '1', 1, '1', NULL, 130, 'pending', 1, '2024-07-07', NULL, NULL, '2024-07-06 12:06:24'),
(14, '18', 4, '1', NULL, 110, 'cancelled', 1, '2024-07-08', NULL, NULL, '2024-07-06 12:23:36'),
(15, '18', 2, '1', NULL, 115, 'cancelled', 1, '2024-07-07', NULL, NULL, '2024-07-06 12:29:39'),
(16, '18', 8, '1', NULL, 100, 'cancelled', 1, '2024-07-10', NULL, NULL, '2024-07-06 12:23:51'),
(17, '1', 3, '1', NULL, 120, 'pending', 1, '2024-07-08', NULL, NULL, '2024-07-07 03:41:33'),
(18, '1', 10, '1', NULL, 120, 'pending', 1, '2024-07-11', NULL, NULL, '2024-07-07 03:41:33'),
(19, '1', 11, '1', NULL, 105, 'pending', 1, '2024-07-12', NULL, NULL, '2024-07-07 03:41:33'),
(20, '18', 5, '1', NULL, 110, 'cancelled', 1, '2024-07-09', NULL, NULL, '2024-07-06 12:23:39'),
(21, '18', 11, '1', NULL, 105, 'cancelled', 1, '2024-07-12', NULL, NULL, '2024-07-06 12:22:59'),
(22, '18', 6, '1', NULL, 105, 'cancelled', 1, '2024-07-09', NULL, NULL, '2024-07-06 12:22:59'),
(23, '18', 12, '1', NULL, 125, 'cancelled', 1, '2024-07-12', NULL, NULL, '2024-07-06 12:23:48'),
(24, '18', 10, '1', NULL, 120, 'pending', 1, '2024-07-11', NULL, NULL, '2024-07-07 04:26:43'),
(25, '18', 9, '1', NULL, 110, 'cancelled', 1, '2024-07-11', NULL, NULL, '2024-07-06 12:23:50'),
(26, '1', 6, '1', NULL, 105, 'pending', 1, '2024-07-16', NULL, NULL, '2024-07-10 01:33:44'),
(27, '1', 3, '1', NULL, 120, 'pending', 1, '2024-07-15', NULL, NULL, '2024-07-10 01:33:45'),
(28, '1', 2, '1', NULL, 115, 'cancelled', 1, '2024-07-14', NULL, NULL, '2024-07-10 01:42:50'),
(29, '1', 1, '1', NULL, 130, 'pending', 1, '2024-07-14', NULL, NULL, '2024-07-10 01:42:48'),
(30, '1', 9, '1', NULL, 110, 'pending', 1, '2024-07-11', NULL, NULL, '2024-07-11 07:27:05'),
(31, '1', 14, '1', NULL, 110, 'pending', 1, '2024-07-13', NULL, NULL, '2024-07-10 02:50:26'),
(32, '1', 7, '1', NULL, 110, 'cancelled', 1, '2024-07-10', NULL, NULL, '2024-07-10 03:02:55'),
(33, '1', 13, '1', NULL, 95, 'cancelled', 1, '2024-07-13', NULL, NULL, '2024-07-11 08:26:30');

-- --------------------------------------------------------

--
-- Table structure for table `mrd_setting`
--

CREATE TABLE `mrd_setting` (
  `mrd_setting_id` int NOT NULL,
  `mrd_setting_announcement` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_setting_order_max_days` int NOT NULL,
  `mrd_setting_discount_percentage` int NOT NULL,
  `mrd_setting_discount_date_range` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
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

INSERT INTO `mrd_setting` (`mrd_setting_id`, `mrd_setting_announcement`, `mrd_setting_order_max_days`, `mrd_setting_discount_percentage`, `mrd_setting_discount_date_range`, `mrd_setting_time_limit_lunch`, `mrd_setting_time_limit_dinner`, `mrd_setting_delivery_time_lunch`, `mrd_setting_delivery_time_dinner`, `mrd_setting_delivery_charge`, `mrd_setting_quantity_min`, `mrd_setting_quantity_max`) VALUES
(1, 'This is a test announcement', 60, 0, '', '10:00', '18:00', '12 pm - 3 pm', '6 pm - 9 pm', '30', 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `mrd_user`
--

CREATE TABLE `mrd_user` (
  `mrd_user_id` int NOT NULL,
  `mrd_user_type` enum('customer','chef','delivery','supplier','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_last_otp` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_otp_expiration` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_otp_attempts` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_session_token` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_group_id` int DEFAULT NULL,
  `mrd_user_first_name` char(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_last_name` char(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_image_file_name` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_phone` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `mrd_user_verified` int DEFAULT NULL,
  `mrd_user_email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_password` varchar(100) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_sector_block` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_area` int NOT NULL,
  `mrd_user_payment_phone` varchar(20) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_status` enum('active','inactive') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_meal_prep_ask` int DEFAULT NULL,
  `mrd_user_mealbox` int DEFAULT NULL,
  `mrd_user_total_meal` int DEFAULT NULL,
  `mrd_user_delivery_ask` enum('yes','no') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_delivery_instruction` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mrd_user_meal_size` varchar(4) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_credit` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_credit_to_pay` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `mrd_user_date_added` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mrd_user`
--

INSERT INTO `mrd_user` (`mrd_user_id`, `mrd_user_type`, `mrd_user_last_otp`, `mrd_user_otp_expiration`, `mrd_user_otp_attempts`, `mrd_user_session_token`, `mrd_user_group_id`, `mrd_user_first_name`, `mrd_user_last_name`, `mrd_user_image_file_name`, `mrd_user_phone`, `mrd_user_verified`, `mrd_user_email`, `mrd_user_password`, `mrd_user_address`, `mrd_user_sector_block`, `mrd_user_area`, `mrd_user_payment_phone`, `mrd_user_status`, `mrd_user_meal_prep_ask`, `mrd_user_mealbox`, `mrd_user_total_meal`, `mrd_user_delivery_ask`, `mrd_user_delivery_instruction`, `mrd_user_meal_size`, `mrd_user_credit`, `mrd_user_credit_to_pay`, `mrd_user_date_added`, `updated_at`) VALUES
(1, 'customer', '$2y$12$1Q75HSt4tiv02WzbDRSt4.2QGXLC6JzJLlWI5D1wSj45oD3/vlTWC', '2024-06-26 09:27:35', '0', '46743aeebdc5e2ca6455afe47f4f304083bed933fa919456898a24b7fc8e48f7', 1, 'AKM Miraz Hoss', 'Hossain', '3245t464.jpg', '01673692998', 0, 'akmmirazhossain@gmail.com', '$2y$12$Ha9G2nkjFnGr9oW4C3OxouVxiz4bz.F8iQCxwUJ0.XxTSVH/LCqoq', 'B4, House 124, Road 12, Blo', '', 1, '01673692997', NULL, NULL, 1, 50, 'yes', 'AMI AKM আমি জাহাজের ভেতরে সমুদ্রে থাকি আমার খাবারটা ড্রোন দিয়ে ডেলিভারি দিয়েন', 'L', '1350', '2:245|3:587', '46232', '2024-07-06 22:24:25'),
(16, 'chef', '', '', '', '1234', 0, 'TF Chef', '0', '0', '', 0, '0', '0', '0', '', 2, '0', NULL, NULL, 0, 0, '', NULL, '0', '0', '0', '', '2024-07-03 02:39:17'),
(18, 'customer', '$2y$12$RbKmMp4aT3I.rpmOQgk3TesD5z1yoirlbhT2VzXJpYWnQKBAKnVSq', '2024-07-07 04:30:00', '0', 'decdb6a8ae6021dba6b5e414196256925b201c05d9685f74b80e4920dab856aa', NULL, 'Thatch Bhai', '0', '0', '01673692997', NULL, '0', '0', 'I live in the seajsjssisiajsisiajxuxudsisjsisissisisisi is jajsis', NULL, 2, '0', NULL, NULL, 1, NULL, NULL, 'আমি জাহাজের ভেতরে সমুদ্রে থাকি আমার খাবারটা ড্রোন দিয়ে ডেলিভারি দিয়েন', '0', '0', '0', '2024-06-29 11:07:18', '2024-07-06 22:25:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `mrd_area`
--
ALTER TABLE `mrd_area`
  ADD PRIMARY KEY (`mrd_area_id`);

--
-- Indexes for table `mrd_delivery`
--
ALTER TABLE `mrd_delivery`
  ADD PRIMARY KEY (`mrd_delivery_id`);

--
-- Indexes for table `mrd_food`
--
ALTER TABLE `mrd_food`
  ADD PRIMARY KEY (`mrd_food_id`);

--
-- Indexes for table `mrd_meal_log`
--
ALTER TABLE `mrd_meal_log`
  ADD PRIMARY KEY (`mrd_meal_log_id`);

--
-- Indexes for table `mrd_menu`
--
ALTER TABLE `mrd_menu`
  ADD PRIMARY KEY (`mrd_menu_id`);

--
-- Indexes for table `mrd_notification`
--
ALTER TABLE `mrd_notification`
  ADD PRIMARY KEY (`mrd_notif_id`);

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
-- AUTO_INCREMENT for table `mrd_area`
--
ALTER TABLE `mrd_area`
  MODIFY `mrd_area_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mrd_delivery`
--
ALTER TABLE `mrd_delivery`
  MODIFY `mrd_delivery_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `mrd_food`
--
ALTER TABLE `mrd_food`
  MODIFY `mrd_food_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `mrd_meal_log`
--
ALTER TABLE `mrd_meal_log`
  MODIFY `mrd_meal_log_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mrd_menu`
--
ALTER TABLE `mrd_menu`
  MODIFY `mrd_menu_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `mrd_notification`
--
ALTER TABLE `mrd_notification`
  MODIFY `mrd_notif_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mrd_order`
--
ALTER TABLE `mrd_order`
  MODIFY `mrd_order_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `mrd_setting`
--
ALTER TABLE `mrd_setting`
  MODIFY `mrd_setting_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `mrd_user`
--
ALTER TABLE `mrd_user`
  MODIFY `mrd_user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
