import { EventApi } from "@/api/eventApi";
import { EventInfo } from "@/api/swag";
import { Card, Col, Row, Typography, Dropdown, Checkbox, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useEffect, useMemo, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import themeConfig from "../theme/themeConfig";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/state/session";
import { useQuery } from "@tanstack/react-query";

const { Title } = Typography;

const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

function getSortedEvents(
  events: EventInfo[],
  sortBy: string,
  direction: number
): EventInfo[] {
  switch (sortBy) {
    case SortByT.START_DATE:
      return events.sort((a, b) => (a.startTime - b.startTime) * direction);
    case SortByT.END_DATE:
      return events.sort((a, b) => (a.endTime - b.endTime) * direction);
    case SortByT.NAME:
      return events.sort((a, b) => a.name.localeCompare(b.name) * direction);
    default:
      console.error("Invalid sort type:", sortBy);
      return events;
  }
}

enum SortByT {
  NAME = "Name",
  START_DATE = "Start Date",
  END_DATE = "End Date",
  EVENT_LOCATION = "Event Location",
}

const ViewEvents = () => {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<SortByT>(SortByT.NAME);
  const [sortDirection, setSortDirection] = useState(1);
  const [dietaryFilter, setDietaryFilter] = useState<string[]>([]); // Dietary info filter
  const [reservationFilter, setReservationFilter] = useState<
    "all" | "reserved" | "unreserved"
  >("all"); // Reservation status filter
  const user = useSessionStore((state) => state.user);

  const { data: eventsMap, refetch } = useQuery<Map<number, EventInfo>>({
    queryKey: ["remotes"],
    initialData: new Map(),
    queryFn: async () => {
      return EventApi.getEvents().then((response) => {
        const events = new Map<number, EventInfo>();
        for (const e of response.data) {
          if (!e.eventId) {
            console.error("Event ID is missing");
            continue;
          }
          events.set(e.eventId, e);
        }
        return events;
      });
    },
  });

  const registerForEvent = async (eventId: number) => {
    if (!user?.loggedIn || user?.id === undefined) {
      console.error("User is not logged in");
      router.push("/login");
      return;
    }

    refetch();
    try {
      await EventApi.reserveEvent(eventId);
      refetch();
    } catch (err) {
      console.error("Error registering for event:", err);
    }
  };

  const unregisterForEvent = async (eventId: number) => {
    if (!user?.loggedIn || user?.id === undefined) {
      console.error("User is not logged in");
      router.push("/login");
      return;
    }

    try {
      await EventApi.removeReservationFromUser(eventId);
      refetch();
    } catch (err) {
      console.error("Error registering for event:", err);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: SortByT.NAME,
      key: SortByT.NAME,
      onClick: () => setSortBy(SortByT.NAME),
    },
    {
      label: SortByT.START_DATE,
      key: SortByT.START_DATE,
      onClick: () => setSortBy(SortByT.START_DATE),
    },
    {
      label: SortByT.END_DATE,
      key: SortByT.END_DATE,
      onClick: () => setSortBy(SortByT.END_DATE),
    },
    {
      label: SortByT.EVENT_LOCATION,
      key: SortByT.EVENT_LOCATION,
      onClick: () => setSortBy(SortByT.EVENT_LOCATION),
    },
  ];

  const eventsList = useMemo(() => {
    if (!eventsMap) {
      return [];
    }
    let filteredEvents = Array.from(eventsMap.values());

    // Filter by dietaryInfo
    if (dietaryFilter.length > 0) {
      filteredEvents = filteredEvents.filter((event) =>
        dietaryFilter.every((diet) => event.dietaryInfo?.includes(diet))
      );
    }

    // Filter by reservation status
    if (reservationFilter === "reserved") {
      filteredEvents = filteredEvents.filter((event) =>
        event.reservationIds?.includes(user?.id as number)
      );
    } else if (reservationFilter === "unreserved") {
      filteredEvents = filteredEvents.filter(
        (event) => !event.reservationIds?.includes(user?.id as number)
      );
    }

    // Apply sorting
    return getSortedEvents(filteredEvents, sortBy, sortDirection);
  }, [eventsMap, sortBy, sortDirection, dietaryFilter, reservationFilter]);

  if (!user || user.id === undefined) {
    console.error("User ID is missing");
    return null;
  }

  return (
    <>
      <Header />

      <div style={{ padding: "20px 40px", height: "100%" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title
            level={1}
            style={{
              fontFamily: themeConfig.typography.fontFamily,
              color: themeConfig.colors.textPrimary,
              display: "inline",
            }}
          >
            View Events
          </Title>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <span
              onClick={(e) => e.preventDefault()}
              style={{
                backgroundColor: "#ffffff",
                padding: "5px",
                borderRadius: "8px",
                outline: "2px solid #CCCCCC",
              }}
            >
              Sort by: {sortBy} <DownOutlined style={{ marginLeft: "5px" }} />
            </span>
          </Dropdown>

          <Button
            onClick={() => {
              setSortDirection((d) => d * -1);
            }}
          >
            {sortDirection == 1 ? "Up" : "Down"}
          </Button>
        </div>

        {/* Dietary Filters */}
        <div style={{ margin: "10px 0" }}>
          <Checkbox.Group
            options={["Kosher", "Halal", "Gluten-Free", "Vegan", "Vegetarian"]}
            value={dietaryFilter}
            onChange={setDietaryFilter}
          />
        </div>

        {/* Reservation Filters */}
        <div style={{ marginBottom: "20px" }}>
          <Dropdown
            menu={{
              items: [
                {
                  label: "All Events",
                  key: "all",
                  onClick: () => setReservationFilter("all"),
                },
                {
                  label: "Reserved Events",
                  key: "reserved",
                  onClick: () => setReservationFilter("reserved"),
                },
                {
                  label: "Unreserved Events",
                  key: "unreserved",
                  onClick: () => setReservationFilter("unreserved"),
                },
              ],
            }}
            trigger={["click"]}
          >
            <Button>
              {reservationFilter === "all"
                ? "All Events"
                : reservationFilter === "reserved"
                ? "Reserved"
                : "Unreserved"}
            </Button>
          </Dropdown>
        </div>

        <Row gutter={[16, 16]}>
          {eventsList.length > 0 &&
            eventsList.map((event) => {
              if (!event) {
                return null;
              }

              let reserveButtonText = "Reserve";
              let registered = false;
              let eventFull = false;
              if (event.reservationIds?.includes(user.id as number)) {
                registered = true;
                reserveButtonText = "Unreserve";
              }
              if (event.registeredCount >= event.capacity && !registered) {
                eventFull = true;
                reserveButtonText = "Full";
              }

              return (
                <Col key={event.eventId} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    title={
                      <div style={{ textAlign: "center" }}>
                        {event.name} <br />{" "}
                        <i style={{ fontWeight: "normal" }}>{event.location}</i>
                      </div>
                    }
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "8px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      transition: "transform 0.3s ease",
                    }}
                  >
                    {event.dietaryInfo && (
                      <p style={{ marginBottom: "16px", textAlign: "center" }}>
                        <span
                          style={{
                            backgroundColor: "#A8D5BA",
                            padding: "5px",
                            borderRadius: "8px",
                          }}
                        >
                          {event.dietaryInfo}
                        </span>
                      </p>
                    )}

                    <p>
                      <strong>Starts:</strong>{" "}
                      {formatDate(new Date(event.startTime))}
                    </p>
                    <p>
                      <strong>Ends:</strong>{" "}
                      {formatDate(new Date(event.endTime))}
                    </p>

                    <p>{event.description}</p>

                    <div style={{ textAlign: "center" }}>
                      <Button
                        type="primary"
                        disabled={eventFull}
                        onClick={() => {
                          registered
                            ? unregisterForEvent(event.eventId)
                            : registerForEvent(event.eventId);
                        }}
                      >
                        {reserveButtonText}
                      </Button>
                    </div>

                    <div style={{ marginTop: "10px", textAlign: "center" }}>
                      <p>
                        <strong>Attendees:</strong> {event.registeredCount} /{" "}
                        {event.capacity}
                      </p>
                    </div>
                  </Card>
                </Col>
              );
            })}
        </Row>
      </div>

      <Footer />
    </>
  );
};

export default ViewEvents;
