<?php

return [

    /**
     * Label Name
     */
    'LABEL_NAME'=>[
        'USER' => 'User',
        'POST' => 'Post',
        'POSTCATEGORY' => 'PostCategory',
        'PAGE' => 'Page',
        'CATEGORY' => 'Category',
        'SERVICE' => 'Service',
        'SERVICEBANNER' => 'ServiceBanner',
        'PROJECT' => 'Project',
        'PARTNER' => 'Partner',
        'SLIDER' => 'Slider',
        'CLIENT' => 'Client',
        'CONTACTFORM' => 'ContactForm',
        'FAQ' => 'Faq',
        'SEOMETA' => 'SeoMeta'
    ],

    /**
     * Order Status
     */
    'ORDER_STATUS' => [
        'NEW' => 1,
        'APPROVE' => 2,
        'PICK_UP' => 3,
        'ON_MY_WAY' => 4,
        'COMPLETE' => 5,
        'CANCEL' => 6,
        'VENDOR_CANCEL' => 7,
        'USER_CANCEL' => 8,
    ],
    'DELIVERY_PAID_STATUS' => [
        'PAID' => 1,
        'OVERDUE' => 2,
    ],

    'PAYMENT_TO_HUBVENDOR' => [
        'PAID' => 1,
        'PENDING' => 2,
    ],

    'PAYMENT_FROM_NOVA' => [
        'PENDING' => 1,
        'RECEIVED' => 2,
    ],
    /**
     * Vendor app history status name
     */
    'ORDER_CANCEL_PARAM_NAME' => 'cancel',
    'ORDER_NEW_PARAM_NAME' => 'new',
    'ORDER_COMPLETE_PARAM_NAME' => 'complete',
    'ORDER_PROCESSING_PARAM_NAME' => 'processing',
    'ORDER_PROCESSING_STATUS' => [2,3,4,9],
    'ORDER_CANCEL_STATUS' => [6,7,8],
    'HISTORY_ORDER_PARAM_NAME' => 'history',
    'CURRENT_ORDER_PROCESSING_PARAM_NAME' => 'current',

    /**
     * Delivery location expired mintutes
     */
    'DELIVERY_LOCATION_EXPIRED_MINUTES' => 3,

    /**
     * Delivery Auto Reassign Minutes
     */
    'DELIVERY_AUTO_REASSIGN_MINUTES' => 3,

    /**
     * Maximum weight for checkout
     */
    'MAXIMUM_WEIGHT_FOR_CHECKOUT' => 20,

    /**
     * True status value
     */
    'STATUS_TRUE' => 1,

    /**
     * False status value
     */
    'STATUS_FALSE' => 0,

    /**
     * Delivery Process Admin Cancel Text
     */
    'DELIVERY_PROCESS_ADMIN_CANCEL_TEXT' => 'Admin Cancel',

    /**
     * String default max length
     */
    'STRING_DEFAULT_MAX_LENGTH' => '191',

    /**
     * Vendor Contact Support phone numbers
     */
    'VENDOR_SUPPORT_PHONE_NUMBERS' => ['09977856258','09784240105'],

    /**
     * Minutes to Hours Conversion Rate
     */
    'MINUTE_TO_HOUR_CONVERSION_RATE' => 60,

    /**
     * Minutes to Hours Conversion Rate
     */
    'SECOND_TO_MINUTE_CONVERSION_RATE' => 60,

    /**
     * Vendor Contact Support phone numbers
     */
    'DELIVERY_SUPPORT_PHONE_NUMBERS' => ['09977442241','09790735938'],

    /**
     * Delivery not found order cancel text
     */
    'DELIVERY_NOT_FOUND_ORDER_CANCEL_TEXT' => 'Delivery not found',

    /**
     * System Vendor Reject Description
     */
    'SYSTEM_VENDOR_REJECT_DESCRIPTION' => "Vendor didn't accept order within 5 minutes",

    /**
     * System Auto Cancel Order Description
     */
    'SYSTEM_CANCEL_ORDER_DESCRIPTION' => "Auto cancel by system",

    /**
     * Delivery reassigned limit status message
     */
    'DELIVERY_REASSIGNED_MAX_MESSAGE' => 'Delivery reassigned limit has been reached.',

    /**
     * Delivery reassigned limit status message
     */
    'DELIVERY_PROCESS_STATUS_SORTING_TEXT' => 'status',

    /**
     * Item filter new arrival key name
     */
    'ITEM_FILTER_NEW_ARRIVAL' => 'new_arrival',

    /**
     * Item filter featured key name
     */
    'ITEM_FILTER_BEST_SELLING' => 'best_selling',

    /**
     * Item filter featured key name
     */
    'ITEM_FILTER_FEATURED' => 'featured',

    /**
     * Item filter featured key name
     */
    'ITEM_FILTER_PRICE_Low_To_High' => 'low_to_high',

    /**
     * Item filter featured key name
     */
    'ITEM_FILTER_PRICE_High_To_Low' => 'high_to_low',

    /**
     * Radius
     */
    'RADIUS' => env('RADIUS'),

    /**
     * Tax rate
     */
    'TAX_RATE' => 0.05,

    /**
     * Vendor Emergency cancel text
     */
    'VENDOR_EMERGENCY_CANCEL_TEXT' => 'Vendor Emergency Cancel',

    /**
     * Order Delayed Time
     */
    'ORDER_DELAYED_TIME' => 60,

    /**
     * Item quantity to reduce
     */
    'ITEM_QUANTITY_TO_REDUCE' => 5,

    'ACTIVITY_LOG' => [
        'CREATED_EVENT_NAME' => 'created',
        'UPDATED_EVENT_NAME' => 'updated',
        'DELETED_EVENT_NAME' => 'deleted',
    ],

    'EMERGENCY_CANCEL_COUPON' => [
        // 'customer_group' => App\Enums\CustomerGroupTypeEnum::EmergencyCancel,
        // 'coupon_type' => App\Enums\CouponTypeEnum::TotalAmount,
        // 'discount_type' => App\Enums\DiscountTypeEnum::Fixed,
        'discount_amount' => 3000,
        'min_discount_amount' => 3000,
        'minimum_amount' => 5000,
        'maximum_usuage' => 1,
        'terms_conditions' => 'This coupon can be used only one time.',
        'description' => 'We are really sorry for any convenience in processing your order. Please enjoy your next order with this coupon.',
        '_duration' => 7,
    ],

    'AUTO_CHECKOUT_MSG' => 'Has been checked out automatically by system',

    'MAX_DELIVERY_ASSIGN_DISTANCE' => 3,

    'DATE_FORMAT' => [
        'DATAIL_DATE_FORMAT' => 'Y-m-d h:i A',
        'GENERAL_DATE_FORMAT' => 'Y-m-d',
    ],
    
    /**
     * Imgae size format
     */
    'IMAGE_SIZE' => [
        'THUMBNAIL' => 300,
        'SMALL' => 300,
        'MEDIUM' => 900,
        'LARGE' => 1200,
        'XLARGE' => 1400,
        'SLIDERWIDTH' => 750,
        'SLIDERHEIGHT' => 630,
        'PAGEWIDTH' => 1920,
        'PAGEHEIGHT' => 720,
        'PARTNER' => 200,
        'PROJECTWIDTH' => 600,
        'PROJECTHEIGHT' => 320,
        'SERVICEBANNERWIDTH' => 2000,
        'SERVICEBANNERHEIGHT' => 700,
        'TOPICWIDTH' => 320,
        'TOPICHEIGHT' => 140,
        'INSIGHTWIDTH' => 1080,
        'INSIGHTHEIGHT' => 605,
        'INSIGHTBANNERWIDTH' => 1080,
        'INSIGHTBANNERHEIGHT' => 530,
    ],

    /**
     * Imgae file name format
     */
    'IMAGE_FILE_NAME' => [
        'THUMBNAIL' => '_thumbnail.',
        'SMALL' => '_small.',
        'MEDIUM' => '_medium.',
        'LARGE' => '_large.',
        'BANNER' => '_banner',
        'NORMAL' => '_normal'
        
    ],
    /**
     * Default Image
     */
    'DEFAULT_IMAGE' => 'images/picture.png',
    /**
     * Hubvendor Report Request
     */
    'REPORT_REQUEST_MAIL' => 'paingthumyo41297@gmail.com',

    /**
     * Transaction Error Mail
     */
    'TRANSACTION_ERROR_MAIL' => 'paingthumyo41297@gmail.com',

    'CUSTOMER_NOTIFY_DISTANCE' => 1,

    'ADMIN_MANUAL_COMPLETE_MSG' => 'Admin manually complete',

    'PAYMENT_CASH_ON_DELIVERY' => 'Cash',

    'PAYMENT_ACTIVITY_LOG' => [
        'PAY_API' => 'Pay API process',
        'CALLBACK_API' => 'Callback API process'
    ],

    'UAB_PROVIDER_NAME' => 'UAB Pay',

    'RESPONSE_MESSAGE' => [
        'SUCCESS' => 'SUCCESS',
        'FAIL' => 'FAIL',
        'CANCELLED' => 'CANCELLED',
        'TIMEOUT' => 'TIMEOUT',
        'EXPIRE' => 'EXPIRE',
        'DECLINED' => 'DECLINED',
        'ERROR' => 'ERROR',
        'SYSTEM_ERROR' => 'SYSTEM_ERROR',
    ],
];