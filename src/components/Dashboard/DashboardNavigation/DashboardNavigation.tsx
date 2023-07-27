import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
export function DashboardNavigation() {
    return (
        <Tabs>
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics" disabled>
                    Analytics
                </TabsTrigger>
                <TabsTrigger value="reports" disabled>
                    Reports
                </TabsTrigger>
                <TabsTrigger value="notifications" disabled>
                    Notifications
                </TabsTrigger>
            </TabsList>
        </Tabs>

    )
}