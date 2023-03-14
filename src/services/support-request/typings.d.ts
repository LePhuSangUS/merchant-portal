declare namespace API {
  type SupportRequest = {
    _id?: string;
    ticketId?: string;
    userId?: string;
    type?: string;
    status?: string;
    content?: string;
    side?: Address;
    photos?: string[];
    createdBy?: string;
    id?: string;
    createdAt: Date;
    lastUpdatedBy?: string;
  };
}
