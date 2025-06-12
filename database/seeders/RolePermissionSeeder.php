<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            'dashboard.view',
            // User permissions
            'user.create',
            'user.view',
            'user.edit',
            'user.delete',
            
            // Role permissions
            'role.create',
            'role.view',
            'role.edit',
            'role.delete',
            
            // Permission permissions
            'permission.view',

            'branch.create',
            'branch.view',
            'branch.edit',
            'branch.delete',
            
            // Timeslot permissions
            'timeslot.create',
            'timeslot.view',
            'timeslot.edit',
            'timeslot.delete',
            
            // Schedule permissions
            'schedule.create',
            'schedule.view',
            'schedule.edit',
            'schedule.delete',
            
            // Message permissions
            'message.create',
            'message.view',
            'message.edit',
            'message.delete',
            
            // Notification permissions
            'notification.create',
            'notification.view',
            'notification.edit',
            'notification.delete',

            //Activity Log permissions
            'activity_log.view',
            
            // Product permissions (example)
            'product.create',
            'product.view',
            'product.edit',
            'product.delete',

            // Category permissions (example)
            'category.create',
            'category.view',
            'category.edit',
            'category.delete',

            // Order permissions (example)
            'order.create',
            'order.view',
            'order.edit',
            'order.delete',

            //Service permissions (example)
            'service.create',
            'service.view',
            'service.edit',
            'service.delete',

            //Page permissions (example)
            'page.create',
            'page.view',
            'page.edit',
            'page.delete',

            //Client permissions (example)
            'client.create',
            'client.view',
            'client.edit',
            'client.delete',

            //Subscriber permissions (example)
            'subscriber.create',
            'subscriber.view',
            'subscriber.edit',
            'subscriber.delete',

            //setting permissions (example)
            'setting.create',
            'setting.view',
            'setting.edit',
            'setting.delete',

            //Slider permissions (example)
            'slider.create',
            'slider.view',
            'slider.edit',
            'slider.delete',

            //post permissions (example)
            'post.create',
            'post.view',
            'post.edit',
            'post.delete',

            //project permissions (example)
            'project.create',
            'project.view',
            'project.edit',
            'project.delete',

            //testimonial
            'testimonial.create',
            'testimonial.view',
            'testimonial.edit',
            'testimonial.delete',
            
            //inquiry
            'inquiry.create',
            'inquiry.view',
            'inquiry.edit',
            'inquiry.delete',

            //staff
            'staff.create',
            'staff.view',
            'staff.edit',
            'staff.delete',

            //staff availability
            'staff_availability.create',
            'staff_availability.view',
            'staff_availability.edit',
            'staff_availability.delete',
            
            //booking
            'booking.create',
            'booking.view',
            'booking.edit',
            'booking.delete',

            //chat
            'chat.create',
            'chat.view',
            'chat.edit',
            'chat.delete',

            
            

            
            // Add more permissions as needed
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles and assign permissions
        $superAdminRole = Role::firstOrCreate(['name' => 'Super Admin', 'guard_name' => 'web']);
        $superAdminRole->givePermissionTo(Permission::all());

        $admin = Role::firstOrCreate(['name' => 'Admin', 'guard_name' => 'web']);
        $admin->givePermissionTo([
            'dashboard.view',
            'user.create',
            'user.view',
            'user.edit',
            'role.view',
            'product.create',
            'product.view',
            'product.edit',
            'product.delete',
            'category.create',
            'category.view',
            'category.edit',
            'category.delete',
        ]);

        $user = Role::firstOrCreate(['name' => 'User', 'guard_name' => 'web']);
        $user->givePermissionTo([
            'product.view',
            'user.view', // Allow users to view their own profile
        ]);

        $manager = Role::firstOrCreate(['name' => 'Manager', 'guard_name' => 'web']);
        $manager->givePermissionTo([
            'dashboard.view',
        ]);

         // ==================== SUPER ADMIN USER ====================
        $superAdmin = User::updateOrCreate(
            ['email' => 'superadmin@admin.com'],
            [
                'name' => 'Super Admin',
                'password' => Hash::make('Password123!'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]
        );

        // Ensure the user has only the Super Admin role
        $superAdmin->syncRoles($superAdminRole);

        $this->command->info('Roles and permissions seeded successfully!');
        $this->command->info('Super Admin Credentials:');
        $this->command->info('Email: superadmin@example.com');
        $this->command->info('Password: SecurePassword123!');
    }
}