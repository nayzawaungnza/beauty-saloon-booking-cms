<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('staff_availabilities', function (Blueprint $table) {
            $table->date('expiry_date')->nullable()->after('effective_date');
            $table->boolean('is_recurring')->default(false)->after('expiry_date');
            $table->json('recurrence_pattern')->nullable()->after('is_recurring');
            $table->date('recurrence_end_date')->nullable()->after('recurrence_pattern');
            $table->integer('priority')->default(0)->after('recurrence_end_date');
            $table->text('notes')->nullable()->after('priority');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('staff_availabilities', function (Blueprint $table) {
            $table->dropColumn([
                'expiry_date',
                'is_recurring',
                'recurrence_pattern',
                'recurrence_end_date',
                'priority',
                'notes'
            ]);
        });
    }
};
