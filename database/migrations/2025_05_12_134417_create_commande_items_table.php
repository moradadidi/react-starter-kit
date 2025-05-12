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
        Schema::create('commande_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained()->onDelete('cascade');
            $table->string('part_name'); // e.g., طحن العظم, دجاج, غسل العظم, etc.
            $table->float('quantity')->nullable(); // e.g., 6760
            $table->float('rate')->nullable();     // e.g., 0.80
            $table->float('total')->nullable();    // e.g., 5408
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commande_items');
    }
};
