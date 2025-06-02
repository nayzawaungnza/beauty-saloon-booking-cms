<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class ActiveStatusEnum extends Enum
{
    const Inactive = 0;
    const Active = 1;

    /**
     * @param int
     * @return string
     */
    public static function getLabel($key)
    {
        switch ($key) {
            case self::Active:
                return "Active";
            case self::Inactive:
                return "Inactive";
            default:
                return "";
        }
    }
}