import React, { useEffect, useState } from 'react';
import { ChatBox } from '@/components/Chat/ChatBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageService } from '@/services/message-service';
import { ChatMessage } from '@/types/message';
import { UserDto } from '@/types/user';
import { jwtDecode } from 'jwt-decode';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Utility to get user id from JWT token
function getUserIdFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return '';
  try {
    const decoded: any = jwtDecode(token);
    console.log('Decoded JWT:', decoded);

    return (
      decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
      decoded.NameIdentifier ||
      decoded.userId ||
      decoded.id ||
      ''
    );
  } catch {
    return '';
  }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ChatPage: React.FC = () => {
  const { state: authState } = useAuth();
  const { t, isRTL } = useLanguage();
  const [selectedUser, setSelectedUser] = useState<UserDto | null>(null);
  const [contacts, setContacts] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = getUserIdFromToken();

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const partners = await MessageService.getChatPartners();
        setContacts(partners);
      } catch (err: any) {
        setError(t('common.error'));
        setContacts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, [authState.user, t]);

  // Extract and deduplicate unique chat partners
  let uniquePartners: UserDto[] = [];
  if (authState.user) {
    const partners = contacts.map(chat => {
      if (!chat.sender || !chat.receiver) return undefined;
      return String(chat.sender.userId) === currentUserId ? chat.receiver : chat.sender;
    }).filter(Boolean) as UserDto[]; // Remove undefined

    uniquePartners = partners.filter(
      (partner, index, self) =>
        partner && // Defensive: partner is not undefined
        index === self.findIndex(p => p && String(p.userId) === String(partner.userId))
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Chat list as horizontal bar on small screens, sidebar on md+ */}
      <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r flex md:flex-col">
        <Card className="flex-1 rounded-none border-0">
          <CardHeader>
            <CardTitle>{t('nav.messages')}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-2 p-2">
            <div className="flex md:flex-col flex-row md:overflow-y-auto overflow-x-auto whitespace-nowrap">
              {loading ? (
                <div className="text-muted-foreground text-center mt-8">{t('common.loading')}</div>
              ) : error ? (
                <div className="text-destructive text-center mt-8">{error}</div>
              ) : uniquePartners.length === 0 ? (
                <div className="text-muted-foreground text-center mt-8">{t('chat.noMessagesYet')}</div>
              ) : (
                uniquePartners.map(partner => (
                  <Button
                    key={String(partner.userId)}
                    variant={String(selectedUser?.userId) === String(partner.userId) ? 'default' : 'outline'}
                    className="md:w-full w-48 md:mb-2 mb-0 mr-2 md:mr-0 justify-start flex items-center gap-2"
                    onClick={() => setSelectedUser(partner)}
                  >
                    <Avatar className="h-8 w-8">
                      {/* Try to use imageURL if available, fallback to initials */}
                      {('imageURL' in partner && (partner as any).imageURL) ? (
                        <AvatarImage src={(partner as any).imageURL} alt={partner.fullName} />
                      ) : null}
                      <AvatarFallback>{getInitials(partner.fullName)}</AvatarFallback>
                    </Avatar>
                    <span className="truncate">{partner.fullName}</span>
                  </Button>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex items-center justify-center">
        {selectedUser ? (
          <ChatBox
            chatPartnerId={String(selectedUser.userId)}
            chatPartnerName={selectedUser.fullName}
            onClose={() => setSelectedUser(null)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="text-2xl text-muted-foreground mb-2">{t('chat.typeMessage')}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
