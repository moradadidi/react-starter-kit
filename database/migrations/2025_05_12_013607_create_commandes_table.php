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
        Schema::create('commandes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained()->onDelete('cascade'); 
            $table->foreignId('type_id')->constrained()->onDelete('cascade'); 
            $table->date('date');
            $table->integer('quantity');
            $table->float('unit_price'); 
            $table->float('total_amount'); 
            $table->float('paid_amount')->default(0); 
            $table->float('rest')->computed('total_amount - paid_amount'); 
            $table->string('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes');
    }
};
