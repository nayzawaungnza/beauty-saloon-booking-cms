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
        Schema::create('images', function (Blueprint $table) {
           $table->uuid('id')->primary();
            $table->string('resourceable_type');
            $table->uuid('resourceable_id');
            $table->string('image_url')->nullable();
            $table->boolean('is_default')->default(false);
            $table->boolean('is_banner')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('images');
    }
};